/**
 * The `discoverSkill` tool. Given the user's question, it:
 *
 *   1. Lists every installed skill via `SkillStorage.listSkills`.
 *   2. Reads each skill's instructions in parallel and extracts the
 *      `## When to use` section (truncated to 120 chars) as a compact hint.
 *   3. Builds a text catalog (`id | name | description | when-to-use`) and
 *      sends a single cheap LLM call (the session's current model, no tools)
 *      asking it to rank the relevant skills and produce a generic ordering
 *      hint (`nextStep`).
 *   4. Validates the JSON response, filters out any hallucinated skill IDs
 *      (IDs not present in the actual catalog), and returns the ranked list.
 *
 * The orchestrator calls this BEFORE `runSkill` so it never has to guess
 * skill names/ids — the catalog is dynamic (built-in + user-created) and the
 * static system prompt stays compact regardless of catalog size.
 *
 * Ported from the `spatial-agent` reference; adapted to kepler's store shape
 * (no subscription-plan RAG tier, no budget-exceeded propagation).
 */

import {z} from 'zod';
import {tool} from 'ai';
import type {SkillStorage, SkillListing} from '@sqlrooms/ai';
import type {AiSliceState} from '@sqlrooms/ai-core';
import type {StoreApi} from '@sqlrooms/room-store';

const DISCOVER_SKILL_DESCRIPTION =
  'Discover which skills are relevant for a given user question. ' +
  'Returns ranked skill IDs, a one-line reason for each, and a generic ordering hint (nextStep). ' +
  'Call this before runSkill to identify the right skill(s) to execute.';

/**
 * Shared `describe()` text for the `reasoning` field. Asks for a short
 * domain-language status phrase shown in the user-facing activity log,
 * rather than a rationale that references internal machinery.
 */
const ACTIVITY_REASONING_DESCRIPTION =
  'A short, user-facing status phrase in plain domain terms describing what is happening, shown ' +
  'in the activity log (e.g. "Finding the right skill for this request"). Do NOT mention skill ' +
  'names/ids, orchestration, sub-agents, or internal tooling.';

/**
 * Extract the "When to use" section from a skill body (stripped of code fences).
 * Returns an empty string when the section is absent.
 */
function extractWhenToUse(body: string): string {
  const match = body.match(/^##\s+When to [Uu]se\s*\n([\s\S]*?)(?=\n##\s|$)/);
  if (!match) return '';
  return match[1]
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

function buildCatalog(
  listings: SkillListing[],
  instructionsMap: Map<string, string>,
): string {
  return listings
    .map((l) => {
      const instructions = instructionsMap.get(l.ref.id) ?? '';
      const whenToUse = extractWhenToUse(instructions);
      const whenPart = whenToUse ? ` | ${whenToUse.slice(0, 120)}` : '';
      return `${l.ref.id} | ${l.manifest.name} | ${l.manifest.description}${whenPart}`;
    })
    .join('\n');
}

const SYSTEM_INSTRUCTIONS = `You are a skill-discovery assistant. Given the user's question and a catalog of available skills, select the most relevant skills and explain how they relate.

RULES:
- Return ONLY valid JSON matching this schema: { "skills": [{ "id": string, "name": string, "why": string }], "nextStep": string }
- "skills" must only contain IDs from the provided catalog. Do NOT invent skill IDs.
- "why" is a one-sentence justification for each selected skill.
- "nextStep" is a GENERIC skill-ordering hint describing how the selected skills relate/sequence. Do NOT name specific agents, MCP tools, or concrete commands — only describe abstract ordering among the skills (e.g. "run the classification skill first to produce a categorized dataset, then pass it to the colocation skill").
- If no skill is relevant, return { "skills": [], "nextStep": "No applicable skills found." }
- Select at most 5 skills. Prefer fewer when the question is narrow.
- Return raw JSON only — no markdown fences, no explanation outside the JSON.`;

export interface DiscoverSkillResult {
  success: boolean;
  skills?: Array<{id: string; name: string; why: string}>;
  nextStep?: string;
  error?: string;
}

const ResponseSchema = z.object({
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      why: z.string(),
    }),
  ),
  nextStep: z.string(),
});

export interface CreateDiscoverSkillToolOptions {
  store: StoreApi<AiSliceState>;
  storage: SkillStorage;
}

export function createDiscoverSkillTool({
  store,
  storage,
}: CreateDiscoverSkillToolOptions) {
  return tool({
    description: DISCOVER_SKILL_DESCRIPTION,
    inputSchema: z.object({
      query: z.string().describe("The user's question or task description"),
      reasoning: z.string().describe(ACTIVITY_REASONING_DESCRIPTION),
    }),
    execute: async ({
      query,
    }: {
      query: string;
      reasoning: string;
    }): Promise<DiscoverSkillResult> => {
      const listings = await storage.listSkills();
      if (listings.length === 0) {
        return {success: true, skills: [], nextStep: 'No skills available.'};
      }

      const instructionsMap = new Map<string, string>();
      await Promise.all(
        listings.map(async (l) => {
          try {
            const record = await storage.readSkill(l.ref);
            instructionsMap.set(l.ref.id, record.instructions);
          } catch {
            // Skip skills that fail to read
          }
        }),
      );

      const catalog = buildCatalog(listings, instructionsMap);
      const validIds = new Set(listings.map((l) => l.ref.id));

      const prompt = `User question: ${query}\n\nSkill catalog (format: id | name | description | when-to-use):\n${catalog}`;

      const currentState = store.getState();

      let response: string;
      try {
        // One-shot LLM call using the session's current model, no tools exposed.
        response = await currentState.ai.sendPrompt(prompt, {
          systemInstructions: SYSTEM_INSTRUCTIONS,
          useTools: false,
        });
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: `Discovery LLM call failed: ${errMsg}`,
        };
      }

      // sendPrompt returns 'error: can not generate response' on internal
      // failure — surface that as a discovery error rather than feeding it
      // to JSON.parse.
      if (response.startsWith('error:')) {
        return {
          success: false,
          error: `Discovery LLM call failed: ${response}`,
        };
      }

      const cleaned = response.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
      let raw: unknown;
      try {
        raw = JSON.parse(cleaned);
      } catch {
        return {
          success: false,
          error: `Discovery response was not valid JSON. Raw: ${response.slice(0, 200)}`,
        };
      }
      const result = ResponseSchema.safeParse(raw);
      if (!result.success) {
        return {
          success: false,
          error: `Discovery response had unexpected shape: ${result.error.message}`,
        };
      }
      const parsed = result.data;

      // Hallucination guard: drop any returned skill ID not in the actual
      // catalog so the LLM cannot invent skill IDs.
      const dropped = parsed.skills.filter((s) => !validIds.has(s.id));
      if (dropped.length) {
        console.warn(
          '[discoverSkill] hallucinated IDs filtered:',
          dropped.map((s) => s.id),
        );
      }
      const validatedSkills = parsed.skills.filter((s) => validIds.has(s.id));

      return {
        success: true,
        skills: validatedSkills,
        nextStep: parsed.nextStep,
      };
    },
  });
}
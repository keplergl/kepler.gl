import type {SkillListing} from '@sqlrooms/ai';

/**
 * Build the "## Skills" prompt section. Instead of listing every skill inline,
 * directs the model to call `discoverSkill` first, keeping the static prompt
 * compact regardless of catalog size (built-in + user-created skills).
 *
 * Ported from the `spatial-agent` reference; kept local because the exact
 * format tends to drift per host.
 */
export function buildSkillsPromptFromListings(_listings: readonly SkillListing[]): string {
  return `## Skills

You have access to a catalog of skills for specialized spatial-analysis tasks. Your
skill catalog is dynamic, so you do NOT know your full capabilities up front.

You do NOT have any direct kepler/duckdb/geo tools of your own — skills are the
only way to perform map, data, or spatial-analysis operations. NEVER tell the
user a task is outside your capabilities, refuse, or suggest external
websites/apps/tools until \`discoverSkill\` has returned no relevant skill for
that request.

To find the right skill(s) for a task:
1. Call \`discoverSkill\` with the user's question. It returns ranked skill IDs,
   a one-line reason for each, and a generic ordering hint (\`nextStep\`).
2. Use the returned skill IDs with \`runSkill\` to execute. Pass the skill **id**
   (not the display name) and a concrete goal derived from the user's request.
3. If \`discoverSkill\` returns one clearly-relevant skill, just run it — do not
   stop to announce the list of skills you found or ask the user to confirm.
4. Only after \`discoverSkill\` returns no relevant skill should you answer
   conversationally (explain concepts, interpret results, or ask the user to
   clarify/refine the request so it maps to a skill).

IMPORTANT: Always call \`discoverSkill\` first — do NOT guess skill names or IDs.`;
}

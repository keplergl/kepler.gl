/**
 * Built-in skills for the kepler.gl AI assistant. The actual skill content is
 * authored as real `SKILL.md` + `skill.yaml` files on disk under
 * `skills/built-in/<id>/` and bundled into `bundledSkills.ts` by
 * `scripts/generate-skills.mjs` (run as a prebuild step). This file just
 * re-exports the generated array so the rest of the codebase has a stable
 * import path.
 *
 * Every seed is round-tripped through `loadSkillFromFiles` at storage
 * construction time, so a malformed skill file crashes the app on startup
 * (the desired fail-loud behavior).
 */

import type {SkillFile} from '@sqlrooms/ai';
import {BUNDLED_SKILLS} from './bundledSkills';

export interface SeedSkill {
  id: string;
  rootId: string;
  files: SkillFile[];
}

export const SEED_SKILLS: SeedSkill[] = BUNDLED_SKILLS;

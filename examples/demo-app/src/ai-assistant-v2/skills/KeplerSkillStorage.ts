/**
 * In-memory `SkillStorage` for the kepler.gl AI assistant. Keeps two roots:
 *
 * - `built-in`: read-only, seeded from `SEED_SKILLS` at construction time.
 * - `default`: writable, reserved for a future AI-authoring wizard.
 *
 * Every seed is round-tripped through `loadSkillFromFiles` so a malformed seed
 * crashes the app on startup (the desired fail-loud behavior).
 */

import {
  loadSkillFromFiles,
  serializeSkillManifest,
  SkillManifestError,
  SkillNotFoundError,
  SkillRootReadOnlyError,
  type SkillFile,
  type SkillListing,
  type SkillManifest,
  type SkillRecord,
  type SkillRef,
  type SkillRoot,
  type SkillStorage,
  type SkillWriteContent
} from '@sqlrooms/ai';
import {SEED_SKILLS, type SeedSkill} from './seedSkills';

const ROOTS: SkillRoot[] = [
  {id: 'default', label: 'My skills', writable: true},
  {id: 'built-in', label: 'Built-in', writable: false}
];

const RESERVED_SKILL_FILES = ['skill.yaml', 'SKILL.md'];

interface StoredSkill {
  files: SkillFile[];
  manifest: SkillManifest;
}

export class KeplerSkillStorage implements SkillStorage {
  private byRoot: Map<string, Map<string, StoredSkill>> = new Map();
  /** Notifier fired on every mutation so UI can refetch listings. */
  private listeners: Set<() => void> = new Set();

  constructor() {
    for (const root of ROOTS) this.byRoot.set(root.id, new Map());

    for (const seed of SEED_SKILLS) {
      // Validate via the real loader. A broken seed throws and the app
      // fails to boot — exactly what we want.
      const {manifest} = loadSkillFromFiles(seed.files);
      if (manifest.id !== seed.id) {
        throw new Error(`Seed skill "${seed.id}" has mismatched manifest.id "${manifest.id}"`);
      }
      const rootMap = this.byRoot.get(seed.rootId);
      if (!rootMap) {
        throw new Error(`Seed skill "${seed.id}" targets unknown rootId "${seed.rootId}"`);
      }
      rootMap.set(seed.id, {files: seed.files, manifest});
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const l of this.listeners) l();
  }

  async listRoots(): Promise<SkillRoot[]> {
    return ROOTS;
  }

  async listSkills(rootId?: string): Promise<SkillListing[]> {
    const rootIds = rootId ? [rootId] : ROOTS.map(r => r.id);
    const out: SkillListing[] = [];
    for (const rId of rootIds) {
      const rootMap = this.byRoot.get(rId);
      if (!rootMap) continue;
      for (const [id, stored] of rootMap) {
        out.push({ref: {rootId: rId, id}, manifest: stored.manifest});
      }
    }
    return out;
  }

  async readSkill(ref: SkillRef): Promise<SkillRecord> {
    const rootMap = this.byRoot.get(ref.rootId);
    const stored = rootMap?.get(ref.id);
    if (!stored) {
      throw new SkillNotFoundError(`Skill "${ref.id}" not found in root "${ref.rootId}"`, {ref});
    }
    const {manifest, instructions, extraFiles} = loadSkillFromFiles(stored.files);
    return {ref, manifest, instructions, extraFiles};
  }

  /**
   * Resolve a writable root, throwing structured errors if the root is
   * unknown or read-only. Returns the backing map so callers can mutate it.
   */
  private getWritableRootMap(rootId: string): Map<string, StoredSkill> {
    const root = ROOTS.find(r => r.id === rootId);
    if (!root) {
      throw new SkillManifestError(`Unknown root: ${rootId}`, {rootId});
    }
    if (!root.writable) {
      throw new SkillRootReadOnlyError(`Root "${rootId}" is read-only`, {
        rootId
      });
    }
    // byRoot is populated for every ROOTS entry in the constructor.
    return this.byRoot.get(rootId)!;
  }

  async writeSkill(rootId: string, id: string, content: SkillWriteContent): Promise<SkillRef> {
    const rootMap = this.getWritableRootMap(rootId);
    if (content.manifest.id !== id) {
      throw new SkillManifestError(
        `Skill id "${id}" must match manifest.id "${content.manifest.id}"`,
        {rootId}
      );
    }
    // Validate extra file paths: no absolute paths, no path traversal.
    for (const file of content.extraFiles ?? []) {
      if (file.relativePath.startsWith('/') || file.relativePath.split('/').includes('..')) {
        throw new SkillManifestError(
          'Skill file path must be relative and cannot escape the skill directory',
          {rootId}
        );
      }
      if (RESERVED_SKILL_FILES.includes(file.relativePath)) {
        throw new SkillManifestError(
          'Skill file path must not use a reserved name (skill.yaml, SKILL.md)',
          {rootId}
        );
      }
    }
    const files: SkillFile[] = [
      {
        relativePath: 'skill.yaml',
        content: serializeSkillManifest(content.manifest)
      },
      {relativePath: 'SKILL.md', content: content.instructions},
      ...(content.extraFiles ?? [])
    ];
    rootMap.set(id, {files, manifest: content.manifest});
    this.notify();
    return {rootId, id};
  }

  async deleteSkill(ref: SkillRef): Promise<void> {
    const rootMap = this.getWritableRootMap(ref.rootId);
    if (!rootMap.has(ref.id)) {
      throw new SkillNotFoundError(`Skill "${ref.id}" not found in root "${ref.rootId}"`, {ref});
    }
    rootMap.delete(ref.id);
    this.notify();
  }

  async resolveSkillId(id: string): Promise<SkillRef | null> {
    for (const root of ROOTS) {
      const rootMap = this.byRoot.get(root.id);
      if (rootMap?.has(id)) return {rootId: root.id, id};
    }
    return null;
  }
}

export type {SeedSkill};

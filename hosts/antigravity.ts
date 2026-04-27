import type { HostConfig } from '../scripts/host-config';

/**
 * Antigravity host config.
 *
 * Antigravity is Google's agentic IDE. It supports MCP, has a built-in
 * terminal, and runs Gemini by default (with user-configurable model
 * routing). Skill artifacts land under `.antigravity/skills/gstack/` so
 * Antigravity discovers them without conflicting with Claude Code's
 * `.claude/skills/` tree.
 *
 * Modeled on the Cursor host config — both are Cursor-like IDEs with their
 * own skill directories, env-var availability, and no special metadata
 * generation.
 */
const antigravity: HostConfig = {
  name: 'antigravity',
  displayName: 'Antigravity',
  cliCommand: 'antigravity',
  cliAliases: [],

  globalRoot: '.antigravity/skills/gstack',
  localSkillRoot: '.antigravity/skills/gstack',
  hostSubdir: '.antigravity',
  usesEnvVars: true,

  frontmatter: {
    mode: 'allowlist',
    keepFields: ['name', 'description'],
    descriptionLimit: null,
  },

  generation: {
    generateMetadata: false,
    // codex skill is OpenAI-Codex-specific; not relevant in an Antigravity
    // (Gemini-default) deployment.
    skipSkills: ['codex'],
  },

  pathRewrites: [
    { from: '~/.claude/skills/gstack', to: '~/.antigravity/skills/gstack' },
    { from: '.claude/skills/gstack', to: '.antigravity/skills/gstack' },
    { from: '.claude/skills', to: '.antigravity/skills' },
  ],

  // Skills that delegate to gbrain for context-load / save expect the
  // GBRAIN_* resolvers; Antigravity supports gbrain via MCP, but the
  // shorthand resolvers assume Claude Code's filesystem layout. Suppress
  // them — agents on Antigravity should call gbrain directly via MCP.
  suppressedResolvers: ['GBRAIN_CONTEXT_LOAD', 'GBRAIN_SAVE_RESULTS'],

  runtimeRoot: {
    globalSymlinks: ['bin', 'browse/dist', 'browse/bin', 'gstack-upgrade', 'ETHOS.md'],
    globalFiles: {
      'review': ['checklist.md', 'TODOS-format.md'],
    },
  },

  install: {
    prefixable: false,
    linkingStrategy: 'symlink-generated',
  },

  learningsMode: 'basic',
};

export default antigravity;

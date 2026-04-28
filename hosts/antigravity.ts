import type { HostConfig } from '../scripts/host-config';

/**
 * Antigravity host config.
 *
 * Antigravity is Google's agentic IDE. It supports MCP, has a built-in
 * terminal, and runs Gemini by default (with user-configurable model
 * routing). astack skill artifacts land under `.antigravity/skills/astack/`
 * so Antigravity discovers them without conflicting with Claude Code's
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

  globalRoot: '.antigravity/skills/astack',
  localSkillRoot: '.antigravity/skills/astack',
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
    { from: '~/.claude/skills/astack', to: '~/.antigravity/skills/astack' },
    { from: '.claude/skills/astack', to: '.antigravity/skills/astack' },
    { from: '.claude/skills', to: '.antigravity/skills' },
  ],

  // Skills that delegate to tbrain for context-load / save expect the
  // TBRAIN_* resolvers; Antigravity supports tbrain via MCP, but the
  // shorthand resolvers assume Claude Code's filesystem layout. Suppress
  // them — agents on Antigravity should call tbrain directly via MCP.
  suppressedResolvers: ['TBRAIN_CONTEXT_LOAD', 'TBRAIN_SAVE_RESULTS'],

  runtimeRoot: {
    globalSymlinks: ['bin', 'browse/dist', 'browse/bin', 'astack-upgrade', 'ETHOS.md'],
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

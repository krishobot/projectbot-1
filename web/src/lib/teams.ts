import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TEAMS_DIR = path.resolve(process.cwd(), "..", "teams");

export type TeamSkill = { name: string; source: "gstack" | "tbrain" | "external" };

export type Team = {
  id: string;
  number: string;
  name: string;
  charter: string;
  body: string;
  gstackSkills: string[];
  tbrainSkills: string[];
  brainPages: string[];
};

const TEAM_TITLE = /^# Team \d+ — (.+)$/m;
const CHARTER_LINE = /\*\*Charter:\*\* (.+?)(?=\n\n|\n##)/s;
const SKILL_LINE = /\| `(\/?[a-z0-9_-]+)` \| (gstack|tbrain|gbrain|sibling repo[^|]*|—) \|/g;
const BRAIN_PAGES = /## Brain pages this team writes\s*\n([\s\S]+?)(?=\n##|\n>|\n$|$)/;

function parseFile(filename: string): Team {
  const raw = fs.readFileSync(path.join(TEAMS_DIR, filename), "utf8");
  const { content } = matter(raw);

  const idMatch = filename.match(/^(\d+)-([a-z-]+)\.md$/);
  if (!idMatch) throw new Error(`Bad team filename: ${filename}`);
  const [, number, id] = idMatch;

  const titleMatch = content.match(TEAM_TITLE);
  const name = titleMatch?.[1]?.trim() ?? id;

  const charterMatch = content.match(CHARTER_LINE);
  const charter = charterMatch?.[1]?.trim() ?? "";

  const gstackSkills: string[] = [];
  const tbrainSkills: string[] = [];
  for (const m of content.matchAll(SKILL_LINE)) {
    const [, skillName, source] = m;
    if (source === "gstack") gstackSkills.push(skillName);
    else if (source === "tbrain" || source === "gbrain") tbrainSkills.push(skillName);
  }

  const brainPagesMatch = content.match(BRAIN_PAGES);
  const brainPages = brainPagesMatch
    ? brainPagesMatch[1]
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2).replace(/^`|`.*$/g, "").trim())
    : [];

  return { id, number, name, charter, body: content, gstackSkills, tbrainSkills, brainPages };
}

export function getAllTeams(): Team[] {
  const files = fs
    .readdirSync(TEAMS_DIR)
    .filter((f) => /^\d+-[a-z-]+\.md$/.test(f))
    .sort();
  return files.map(parseFile);
}

export function getTeam(id: string): Team | null {
  const files = fs.readdirSync(TEAMS_DIR);
  const match = files.find((f) => f.endsWith(`-${id}.md`));
  if (!match) return null;
  return parseFile(match);
}

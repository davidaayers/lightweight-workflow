import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MANAGED_PATHS } from "./payload/.opencode/workflow/verify-installation.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const read = path => readFileSync(join(root, "payload", path), "utf8");
function files(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? files(join(directory, entry.name), path) : [path];
  });
}
assert.deepEqual(files(join(root, "payload")).sort(), [...MANAGED_PATHS].sort(), "Payload and managed registry differ");
for (const path of MANAGED_PATHS.filter(path => path.endsWith(".md"))) {
  const source = read(path);
  assert(!/Mahjabble|Godot|GDScript|Supabase|openspec\/|docs\/specs\/|docs\/adr\//i.test(source), `Project-specific core: ${path}`);
  if (/\/(?:agents|commands)\/|\/SKILL\.md$/.test(path)) {
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
    assert(match, `Missing frontmatter/body: ${path}`);
    assert(/^description: \S.+$/m.test(match[1]), `Missing description: ${path}`);
    if (path.includes("/agents/")) {
      assert(/^mode: subagent$/m.test(match[1]) && /  edit: deny\n/.test(match[1]) && /  task: deny\n/.test(match[1]), `Reviewer permissions: ${path}`);
      assert(!/^model:|^variant:/m.test(match[1]), `Model-specific agent: ${path}`);
      assert(match[2].includes(".opencode/workflow/review-contract.md"), `Missing reviewer owner: ${path}`);
    } else if (path.includes("/commands/")) {
      const name = path.split("/").at(-1).replace(".md", "");
      assert.equal(match[2].trim(), `Load and follow the \`${name}\` skill for \`$ARGUMENTS\`.`);
    } else {
      const name = path.split("/").at(-2);
      assert(match[1].includes(`name: ${name}\n`), `Skill name mismatch: ${path}`);
      assert(match[2].includes(".opencode/workflow/project.md"), `Missing adapter reference: ${path}`);
      assert(match[2].includes(".opencode/workflow/policy.md"), `Missing policy reference: ${path}`);
    }
  }
}
console.log(`Source registry, portable instructions, and wiring passed (${MANAGED_PATHS.length} managed files; not semantic proof).`);

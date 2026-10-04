import { createHash } from "node:crypto";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const MANAGED_PATHS = [
  ".opencode/workflow/policy.md",
  ".opencode/workflow/review-contract.md",
  ".opencode/workflow/verify-installation.mjs",
  ...["lightweight-change", "explore", "code-review"].flatMap(name => [
    `.opencode/skills/${name}/SKILL.md`, `.opencode/commands/${name}.md`,
  ]),
  ".opencode/skills/lightweight-change/brief.md",
  ...["code-reviewer", "code-reviewer-targeted", "code-reviewer-deep",
    "architecture-reviewer", "architecture-reviewer-deep",
    "design-reviewer", "design-reviewer-deep"].map(name => `.opencode/agents/${name}.md`),
];
export const STATE_PATH = ".opencode/workflow/installation.json";
export const ADAPTER_PATH = ".opencode/workflow/project.md";
export const digest = bytes => createHash("sha256").update(bytes).digest("hex");

// Never traverse a symlink in paths the installer can write. Missing parents are
// allowed for a fresh install; existing components must have the expected type.
export function inspectPath(root, path) {
  const parts = path.split("/");
  if (parts.some(part => !part || part === "." || part === "..") || path.startsWith("/")) {
    throw new Error(`Invalid relative path: ${path}`);
  }
  let current = root;
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    let stat;
    try { stat = lstatSync(current); }
    catch (error) { if (error.code === "ENOENT") return null; throw error; }
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error(`Expected ${index < parts.length - 1 ? "directory" : "regular file"}: ${current}`);
    }
  }
  return readFileSync(current);
}

export function readState(root) {
  const bytes = inspectPath(root, STATE_PATH);
  if (!bytes) return null;
  const state = JSON.parse(bytes.toString("utf8"));
  if (state.module !== "lightweight-workflow" || state.schema !== 1 ||
      typeof state.version !== "string" || !state.version ||
      !state.files || typeof state.files !== "object" || Array.isArray(state.files)) {
    throw new Error("Invalid lightweight-workflow installation metadata");
  }
  if (Object.keys(state.files).length !== MANAGED_PATHS.length ||
      MANAGED_PATHS.some(path => !/^[a-f0-9]{64}$/.test(state.files[path] ?? ""))) {
    throw new Error("Installation file set differs; use an explicitly reviewed migration");
  }
  return state;
}

export function verifyInstallation(root) {
  const state = readState(root);
  if (!state) throw new Error(`Missing ${STATE_PATH}`);
  const problems = [];
  for (const path of MANAGED_PATHS) {
    const bytes = inspectPath(root, path);
    if (!bytes || digest(bytes) !== state.files[path]) problems.push(`Missing or edited managed file: ${path}`);
  }
  if (!inspectPath(root, ADAPTER_PATH)) problems.push(`Missing project adapter: ${ADAPTER_PATH}`);
  if (problems.length) throw new Error(problems.join("\n"));
  return state;
}

const filename = fileURLToPath(import.meta.url);
if (process.argv[1] && realpathSync(process.argv[1]) === filename) {
  try {
    const root = process.argv[2] ? resolve(process.argv[2]) : resolve(dirname(filename), "../..");
    if (process.argv.length > 3) throw new Error("Usage: node verify-installation.mjs [project]");
    const state = verifyInstallation(root);
    console.log(`lightweight-workflow ${state.version}: ${MANAGED_PATHS.length} managed files match installed hashes (${relative(process.cwd(), root) || "."}).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

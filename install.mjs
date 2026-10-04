import { mkdirSync, readFileSync, realpathSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  ADAPTER_PATH, MANAGED_PATHS, STATE_PATH, digest, inspectPath, readState,
} from "./payload/.opencode/workflow/verify-installation.mjs";

const moduleRoot = dirname(fileURLToPath(import.meta.url));

function writeAtomic(root, path, bytes) {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  writeFileSync(temporary, bytes, { flag: "wx" });
  renameSync(temporary, destination);
}

export function install(project, { check = false, adopt = false, source = moduleRoot } = {}) {
  if (check && adopt) throw new Error("--check and --adopt cannot be combined");
  const root = realpathSync(project);
  if (!statSync(root).isDirectory()) throw new Error("Project must be an existing directory");
  const version = JSON.parse(readFileSync(join(source, "package.json"), "utf8")).version;
  const payload = new Map(MANAGED_PATHS.map(path => [path, readFileSync(join(source, "payload", path))]));
  const state = readState(root);
  const adapter = inspectPath(root, ADAPTER_PATH);
  const issues = [];
  const changed = [];

  // Preflight the complete set before writing, including the metadata and adapter.
  for (const [path, bytes] of payload) {
    const current = inspectPath(root, path);
    const nextHash = digest(bytes);
    const currentHash = current ? digest(current) : null;
    if (currentHash !== nextHash) {
      changed.push(path);
      if (state && currentHash !== state.files[path]) {
        issues.push(`Locally edited or deleted managed file: ${path}`);
      } else if (!state && current && !adopt && !check) {
        issues.push(`Unmanaged conflicting file: ${path} (inspect before initial --adopt)`);
      }
    }
  }
  if (issues.length) throw new Error(issues.join("\n"));
  const nextState = {
    module: "lightweight-workflow", schema: 1, version,
    files: Object.fromEntries([...payload].map(([path, bytes]) => [path, digest(bytes)])),
  };
  if (check) {
    const drift = [...changed];
    if (!state || state.version !== version || MANAGED_PATHS.some(path => state.files[path] !== nextState.files[path])) drift.push(STATE_PATH);
    if (!adapter) drift.push(ADAPTER_PATH);
    if (drift.length) throw new Error(`Installation differs from module ${version}:\n${drift.join("\n")}`);
    return { version, changed: [] };
  }
  for (const path of changed) writeAtomic(root, path, payload.get(path));
  if (!adapter) writeAtomic(root, ADAPTER_PATH, readFileSync(join(source, "templates/project.md")));
  // Publish the ledger last; a partial failure cannot claim a complete update.
  writeAtomic(root, STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
  return { version, changed };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const flags = args.filter(arg => arg.startsWith("--"));
    const projects = args.filter(arg => !arg.startsWith("--"));
    if (projects.length !== 1 || flags.some(flag => !["--check", "--adopt"].includes(flag)) ||
        new Set(flags).size !== flags.length) {
      throw new Error("Usage: node install.mjs [--check | --adopt] <existing-project>");
    }
    const result = install(resolve(projects[0]), {
      check: flags.includes("--check"), adopt: flags.includes("--adopt"),
    });
    console.log(`lightweight-workflow ${result.version}: ${flags.includes("--check") ? "installation matches source" : `${result.changed.length} managed files installed/updated; project adapter preserved`}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

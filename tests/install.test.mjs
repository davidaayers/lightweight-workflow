import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { install } from "../install.mjs";
import { ADAPTER_PATH, STATE_PATH, MANAGED_PATHS, verifyInstallation } from "../payload/.opencode/workflow/verify-installation.mjs";

const moduleRoot = dirname(dirname(fileURLToPath(import.meta.url)));
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "lightweight-workflow-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const project = join(root, "project");
  mkdirSync(project);
  return { root, project };
}
const read = (root, path) => readFileSync(join(root, path), "utf8");
function put(root, path, contents) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), contents);
}
function nextSource(root) {
  const source = join(root, "next-module");
  mkdirSync(source);
  for (const path of ["payload", "templates", "package.json"]) {
    cpSync(join(moduleRoot, path), join(source, path), { recursive: true });
  }
  const packageJson = JSON.parse(read(source, "package.json"));
  packageJson.version = "0.1.1";
  put(source, "package.json", JSON.stringify(packageJson));
  put(source, `payload/${MANAGED_PATHS[0]}`, `${read(source, `payload/${MANAGED_PATHS[0]}`)}\nNext policy revision.\n`);
  return source;
}

test("fresh install is reproducible, preserves unrelated owners, and needs no module checkout to verify", t => {
  const { project } = fixture(t);
  put(project, "AGENTS.md", "Project constraints\n");
  put(project, ".opencode/skills/custom/SKILL.md", "Project-specific skill\n");
  const result = install(project);
  assert.equal(result.changed.length, MANAGED_PATHS.length);
  assert.equal(read(project, "AGENTS.md"), "Project constraints\n");
  assert.equal(read(project, ".opencode/skills/custom/SKILL.md"), "Project-specific skill\n");
  assert.equal(verifyInstallation(project).version, "0.1.0");
  assert.equal(install(project, { check: true }).changed.length, 0);
  const cli = spawnSync(process.execPath, [join(project, ".opencode/workflow/verify-installation.mjs")], { encoding: "utf8" });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /managed files match/);
});

test("check is read-only on a missing install and on source-version drift", t => {
  const { root, project } = fixture(t);
  assert.throws(() => install(project, { check: true }), /differs/);
  assert(!existsSync(join(project, ".opencode")));
  install(project);
  const state = read(project, STATE_PATH);
  const policy = read(project, MANAGED_PATHS[0]);
  const source = nextSource(root);
  assert.throws(() => install(project, { check: true, source }), /0\.1\.1/);
  assert.equal(read(project, STATE_PATH), state);
  assert.equal(read(project, MANAGED_PATHS[0]), policy);
});

test("unmanaged conflicts abort the whole install; explicit initial adoption preserves adapter", t => {
  const { project } = fixture(t);
  const path = ".opencode/skills/lightweight-change/SKILL.md";
  put(project, path, "Existing workflow\n");
  put(project, ADAPTER_PATH, "Project-owned acceptance\n");
  assert.throws(() => install(project), /Unmanaged conflicting/);
  assert.equal(read(project, path), "Existing workflow\n");
  assert(!existsSync(join(project, MANAGED_PATHS[0])));
  assert(!existsSync(join(project, STATE_PATH)));
  install(project, { adopt: true });
  assert.equal(read(project, ADAPTER_PATH), "Project-owned acceptance\n");
  verifyInstallation(project);
});

test("explicit updates change only managed source and retain project adapter", t => {
  const { root, project } = fixture(t);
  install(project);
  put(project, ADAPTER_PATH, "Custom project adapter\n");
  const source = nextSource(root);
  assert.deepEqual(install(project, { source }).changed, [MANAGED_PATHS[0]]);
  assert.equal(read(project, ADAPTER_PATH), "Custom project adapter\n");
  assert.equal(verifyInstallation(project).version, "0.1.1");
  assert.equal(install(project, { check: true, source }).changed.length, 0);
});

test("local edits/deletions block all writes, including with adopt, and verifier detects them", t => {
  const { root, project } = fixture(t);
  install(project);
  const state = read(project, STATE_PATH);
  const policy = read(project, MANAGED_PATHS[0]);
  const edited = ".opencode/commands/code-review.md";
  put(project, edited, "Local edit\n");
  const source = nextSource(root);
  assert.throws(() => verifyInstallation(project), /Missing or edited/);
  assert.throws(() => install(project, { source, adopt: true }), /Locally edited/);
  assert.equal(read(project, STATE_PATH), state);
  assert.equal(read(project, MANAGED_PATHS[0]), policy);
  rmSync(join(project, edited));
  assert.throws(() => install(project, { source }), /deleted/);
  assert.equal(read(project, STATE_PATH), state);
});

test("a retry accepts files already equal to new source while updating the old ledger", t => {
  const { root, project } = fixture(t);
  install(project);
  const source = nextSource(root);
  put(project, MANAGED_PATHS[0], read(source, `payload/${MANAGED_PATHS[0]}`));
  assert.throws(() => verifyInstallation(project), /edited/);
  assert.equal(install(project, { source }).changed.length, 0);
  assert.equal(verifyInstallation(project).version, "0.1.1");
});

test("malformed/foreign ledger and symlinked managed parents cannot authorize writes", t => {
  const { root, project } = fixture(t);
  put(project, STATE_PATH, JSON.stringify({ module: "foreign", files: {} }));
  assert.throws(() => install(project, { adopt: true }), /Invalid/);
  assert(!existsSync(join(project, MANAGED_PATHS[0])));
  rmSync(join(project, ".opencode"), { recursive: true });
  const external = join(root, "external");
  mkdirSync(external);
  symlinkSync(external, join(project, ".opencode"));
  assert.throws(() => install(project, { adopt: true }), /Expected directory/);
  assert(!existsSync(join(external, "workflow")));
});

test("CLI drift checks fail without writing; invalid options cannot install", t => {
  const { project } = fixture(t);
  for (const args of [["--check", project], ["--check", "--adopt", project], ["--unknown", project]]) {
    const result = spawnSync(process.execPath, [join(moduleRoot, "install.mjs"), ...args], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert(!existsSync(join(project, ".opencode")));
  }
});

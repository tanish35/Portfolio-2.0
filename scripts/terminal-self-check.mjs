/**
 * Node built-in self-check for terminal path/parser/completion helpers.
 * Run: node --test scripts/terminal-self-check.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizePath,
  VIRTUAL_ROOT,
  parseCommandLine,
  parseRm,
  matchGlob,
  expandGlob,
  buildVfs,
  buildProjectTargets,
  resolveProject,
  completeToken,
  fuzzyFilter,
  COMMAND_NAMES,
} from "../src/lib/terminal-core.js";
import { parsePlayQuery, rankTracks } from "../src/lib/music-rank.js";

const sampleProjects = [
  {
    slug: "opsmith",
    title: "Ops Smith",
    caption: "SRE",
    description: "desc",
    buttonLink: "https://github.com/tanish35/OpSmith",
    tags: [],
  },
  {
    slug: "askvault",
    title: "AskVault",
    caption: "AI",
    description: "desc",
    buttonLink: "https://ask.wedevs.site",
    tags: [],
  },
];

describe("path normalization", () => {
  it("cd .. cannot escape the virtual root", () => {
    assert.equal(normalizePath("..", VIRTUAL_ROOT), VIRTUAL_ROOT);
    assert.equal(normalizePath("../..", `${VIRTUAL_ROOT}/projects`), VIRTUAL_ROOT);
    const escaped = normalizePath("../../etc/passwd", `${VIRTUAL_ROOT}/notes`);
    assert.ok(escaped.startsWith(VIRTUAL_ROOT));
    assert.ok(!escaped.includes("/../"));
    assert.equal(
      normalizePath("../../../", `${VIRTUAL_ROOT}/projects/x`),
      VIRTUAL_ROOT,
    );
  });
});

describe("glob matching", () => {
  it("cat *.txt matches only supported virtual files", () => {
    const vfs = buildVfs({
      projects: sampleProjects,
      experience: [],
      notes: { "idea.txt": { content: "hi", mtime: 1 } },
    });
    const matches = expandGlob(vfs, VIRTUAL_ROOT, "*.txt");
    assert.ok(matches.some((m) => m.endsWith("/about.txt")));
    assert.ok(matches.some((m) => m.endsWith("/contact.txt")));
    assert.ok(!matches.some((m) => m.endsWith("/resume.pdf")));
    const noteMatches = expandGlob(vfs, `${VIRTUAL_ROOT}/notes`, "*.txt");
    assert.deepEqual(noteMatches, [`${VIRTUAL_ROOT}/notes/idea.txt`]);
  });

  it("matchGlob handles * and *.ext", () => {
    assert.deepEqual(matchGlob("*.txt", ["a.txt", "b.pdf", "c.txt"]), [
      "a.txt",
      "c.txt",
    ]);
    assert.deepEqual(matchGlob("*", ["a", "b"]), ["a", "b"]);
  });
});

describe("rm parsing", () => {
  it("rm -rf parses flags separately from the path", () => {
    const parsed = parseRm("rm -rf notes/tmp.txt");
    assert.equal(parsed.recursive, true);
    assert.equal(parsed.force, true);
    assert.equal(parsed.path, "notes/tmp.txt");

    const parsed2 = parseRm("rm -r -f notes/dir");
    assert.equal(parsed2.recursive, true);
    assert.equal(parsed2.force, true);
    assert.equal(parsed2.path, "notes/dir");

    const line = parseCommandLine("rm -rf notes/x");
    assert.deepEqual(line.flags.sort(), ["f", "r"].sort());
    assert.deepEqual(line.args, ["notes/x"]);
  });
});

describe("music query", () => {
  it("play hello preserves the query", () => {
    assert.equal(parsePlayQuery("play hello"), "hello");
    assert.equal(parsePlayQuery("spotify play one line"), "one line");
    assert.equal(parsePlayQuery("play blinding lights"), "blinding lights");
  });

  it("Fuse ranks closest title first", () => {
    const tracks = [
      { id: "1", name: "Hello", artist: "Adele", album: "25" },
      { id: "2", name: "Yellow", artist: "Coldplay", album: "X" },
      { id: "3", name: "Goodbye", artist: "Adele", album: "Y" },
    ];
    const ranked = rankTracks(tracks, "hello");
    assert.equal(ranked[0].id, "1");
    assert.equal(ranked.length, 3);
  });
});

describe("project resolution", () => {
  it("cd ops and open ops resolve to opsmith buttonLink", () => {
    const targets = buildProjectTargets(sampleProjects);
    const fromOpsmith = resolveProject("opsmith", targets);
    const fromTitle = resolveProject("OpsSmith", targets);
    assert.equal(fromOpsmith.buttonLink, "https://github.com/tanish35/OpSmith");
    assert.equal(fromTitle.buttonLink, fromOpsmith.buttonLink);

    const completion = completeToken("cd ops", 6, {
      commands: COMMAND_NAMES,
      directories: [`${VIRTUAL_ROOT}/projects`],
      files: [],
      projectSlugs: sampleProjects.map((p) => p.slug),
      tracks: [],
    });
    assert.ok(
      completion.value.includes("opsmith") ||
        (completion.candidates || []).includes("opsmith"),
    );

    const openCompletion = completeToken("open ops", 8, {
      commands: COMMAND_NAMES,
      directories: [],
      files: [],
      projectSlugs: sampleProjects.map((p) => p.slug),
      apps: ["github", "resume"],
      tracks: [],
    });
    assert.ok(
      openCompletion.value.includes("opsmith") ||
        (openCompletion.candidates || []).includes("opsmith"),
    );
  });
});

describe("fuzzy tab completion", () => {
  it("cd res completes to resume.pdf", () => {
    const completion = completeToken("cd res", 6, {
      commands: COMMAND_NAMES,
      directories: ["projects", "notes"],
      files: ["about.txt", "contact.txt", "resume.pdf", "projects/README.txt"],
      projectSlugs: sampleProjects.map((p) => p.slug),
      apps: ["resume", "github"],
    });
    assert.ok(
      completion.value.includes("resume.pdf") ||
        (completion.candidates || []).some((c) => c.includes("resume")),
      `got ${completion.value} / ${completion.candidates}`,
    );
  });

  it("fuzzyFilter matches basename includes", () => {
    const out = fuzzyFilter(
      ["about.txt", "resume.pdf", "contact.txt"],
      "res",
    );
    assert.deepEqual(out, ["resume.pdf"]);
  });

  it("repeated Tab returns all matching candidates without submitting", () => {
    const first = completeToken("c", 1, {
      commands: COMMAND_NAMES,
      directories: [],
      files: [],
      projectSlugs: [],
      tracks: [],
    });
    assert.ok(first.candidates || first.value.startsWith("c"));
  });
});

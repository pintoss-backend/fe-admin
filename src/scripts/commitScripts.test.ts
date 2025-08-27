/** Testing framework: jest (auto-detected). */
/* Using Jest as the testing framework */
/**
 * Test suite for src/scripts/commitScripts.ts
 * Note: This project uses a Node + TypeScript test runner (Jest or Vitest).
 * The test body below is framework-agnostic where possible; imports are selected via conditionals in setup.
 */
import * as mod from "./commitScripts";

describe("commitScripts - conventional commit utilities (Jest)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("parseCommitMessage", () => {
    test("parses type, optional scope, and subject for a standard message", () => {
      const res = mod.parseCommitMessage("feat(api): add getUsers endpoint");
      expect(res).toEqual({ type: "feat", scope: "api", subject: "add getUsers endpoint" });
    });

    test("parses message without scope", () => {
      const res = mod.parseCommitMessage("fix: correct null pointer");
      expect(res).toEqual({ type: "fix", scope: undefined, subject: "correct null pointer" });
    });

    test("supports breaking change indicator with '!'", () => {
      const res = mod.parseCommitMessage("refactor(core)!: drop deprecated method");
      expect(res).toEqual({ type: "refactor", scope: "core", subject: "drop deprecated method" });
    });

    test("returns empty object for invalid message shapes", () => {
      expect(mod.parseCommitMessage("Update README")).toEqual({});
      expect(mod.parseCommitMessage("feat add x")).toEqual({});
      expect(mod.parseCommitMessage("")).toEqual({});
    });

    test("allows complex scopes with dashes, dots, and slashes", () => {
      const res = mod.parseCommitMessage("chore(app-web.v2/auth/login): bump deps");
      expect(res).toEqual({ type: "chore", scope: "app-web.v2/auth/login", subject: "bump deps" });
    });
  });

  describe("validateCommitMessage", () => {
    test("accepts a valid conventional commit", () => {
      const out = mod.validateCommitMessage("perf(http): cache GET /health");
      expect(out.valid).toBe(true);
      expect(out.errors).toEqual([]);
      expect(out.type).toBe("perf");
      expect(out.scope).toBe("http");
      expect(out.subject).toBe("cache GET /health");
    });

    test("rejects empty or whitespace-only messages", () => {
      const cases = ["", "   ", "\n\t"];
      for (const m of cases) {
        const out = mod.validateCommitMessage(m);
        expect(out.valid).toBe(false);
        expect(out.errors).toContain("empty message");
      }
    });

    test("rejects missing type and subject", () => {
      const out = mod.validateCommitMessage("Update deps");
      expect(out.valid).toBe(false);
      expect(out.errors).toEqual(expect.arrayContaining(["missing type"]));
    });

    test("rejects unknown types", () => {
      const out = mod.validateCommitMessage("unknown(scope): subject");
      expect(out.valid).toBe(false);
      expect(out.errors).toEqual(expect.arrayContaining(["invalid type: unknown"]));
    });

    test("rejects messages with missing subject", () => {
      const out = mod.validateCommitMessage("feat(core):    ");
      expect(out.valid).toBe(false);
      expect(out.errors).toEqual(expect.arrayContaining(["missing subject"]));
    });
  });

  describe("runCommitChecks", () => {
    test("delegates to validateCommitMessage (happy path)", async () => {
      const spy = jest.spyOn(mod, "validateCommitMessage");
      const msg = "docs(readme): improve examples";
      const res = await mod.runCommitChecks(msg);
      expect(spy).toHaveBeenCalledWith(msg);
      expect(res.valid).toBe(true);
    });

    test("handles failure paths and returns error details", async () => {
      const res = await mod.runCommitChecks("docs:");
      expect(res.valid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });
  });

  describe("CONVENTIONAL_TYPES", () => {
    test("includes core types and does not contain duplicates", () => {
      const t = mod.CONVENTIONAL_TYPES;
      expect(Array.isArray(t)).toBe(true);
      const set = new Set(t);
      expect(set.size).toBe(t.length);
      expect(t).toEqual(expect.arrayContaining(["feat","fix","docs","chore","refactor","perf","test","build","ci","style","revert"].filter(Boolean)));
    });
  });
});
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseMarkdown } from "../server/src/utils/markdown.ts";
import { constantTimeEquals } from "../server/src/utils/crypto.ts";
import { requirePostgresDatabaseUrl } from "../server/src/utils/databaseUrl.ts";
import {
  validateAwardCreate,
  validatePostCreate,
  validateProjectCreate,
  validateStackCreate,
} from "../server/src/utils/validation.ts";
import { generateSrcSet } from "../src/shared/utils/responsive-image.util.ts";

describe("parseMarkdown", () => {
  it("parses frontmatter and preserves colons", () => {
    const result = parseMarkdown(
      "---\ntitle: Hello\ndescription: value: with colon\ntags: [react, typescript]\n---\n# Body",
      "fallback.md",
    );

    assert.equal(result.title, "Hello");
    assert.equal(result.description, "value: with colon");
    assert.deepEqual(result.tags, ["react", "typescript"]);
    assert.equal(result.content, "# Body");
  });

  it("uses the filename when frontmatter is absent", () => {
    assert.deepEqual(parseMarkdown("# Body", "post.md"), {
      content: "# Body",
      title: "post",
    });
  });
});

describe("generateSrcSet", () => {
  it("creates responsive R2 variants", () => {
    assert.equal(
      generateSrcSet("https://cdn.example.com/image.webp", [640, 1024]),
      "https://cdn.example.com/image-640w.webp 640w, https://cdn.example.com/image-1024w.webp 1024w",
    );
  });

  it("does not rewrite non-WebP images", () => {
    assert.equal(generateSrcSet("https://cdn.example.com/image.png"), null);
  });
});

describe("request validation", () => {
  it("accepts a valid project and rejects invalid dates and URLs", () => {
    assert.equal(
      validateProjectCreate({
        title: "Portfolio",
        description: "Description",
        startDate: "2026-07-31",
        githubUrl: "https://github.com/example/project",
        techStack: ["TypeScript"],
      }).valid,
      true,
    );

    const invalid = validateProjectCreate({
      title: "Portfolio",
      description: "Description",
      startDate: "not-a-date",
      githubUrl: "javascript:alert(1)",
    });

    assert.equal(invalid.valid, false);
    assert.deepEqual(
      invalid.errors.map((error) => error.field).sort(),
      ["githubUrl", "startDate"],
    );
  });

  it("rejects incomplete awards", () => {
    const result = validateAwardCreate({ title: "Award" });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.field === "organization"));
    assert.ok(result.errors.some((error) => error.field === "date"));
  });
});

describe("security and operations utilities", () => {
  it("compares secrets without accepting length mismatches", () => {
    assert.equal(constantTimeEquals("same-secret", "same-secret"), true);
    assert.equal(constantTimeEquals("short", "different-length"), false);
  });

  it("validates post categories and stack URLs", () => {
    assert.equal(
      validatePostCreate({
        title: "Database dashboard",
        date: "2026-07-31",
        categories: ["TypeScript", "Prisma"],
        projectIds: ["project-id"],
      }).valid,
      true,
    );

    assert.equal(
      validatePostCreate({
        title: "Invalid post",
        date: "invalid",
        categories: "TypeScript",
      }).valid,
      false,
    );

    assert.equal(
      validateStackCreate({
        name: "React",
        imageUrl: "javascript:alert(1)",
      }).valid,
      false,
    );
  });

  it("requires a PostgreSQL database URL", () => {
    assert.equal(
      requirePostgresDatabaseUrl("postgresql://user:pass@localhost:5432/db"),
      "postgresql://user:pass@localhost:5432/db",
    );
    assert.throws(() => requirePostgresDatabaseUrl("file:./dev.db"));
  });
});

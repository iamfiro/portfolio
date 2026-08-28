-- DropIndex
DROP INDEX "Project_notionId_key";
DROP INDEX "Post_notionId_key";
DROP INDEX "Stack_notionId_key";
DROP INDEX "Award_notionId_key";

-- Preserve useful stack metadata under database-owned column names
ALTER TABLE "Stack" RENAME COLUMN "설명" TO "description";
ALTER TABLE "Stack" RENAME COLUMN "카테고리" TO "category";

-- Remove Notion-only identifiers and denormalized relation backups
ALTER TABLE "Project"
  DROP COLUMN "notionId",
  DROP COLUMN "notionProp_c4902d28e9",
  DROP COLUMN "notionProp_a1c5c9ec45";

ALTER TABLE "Post" DROP COLUMN "notionId";

ALTER TABLE "Stack"
  DROP COLUMN "notionId",
  DROP COLUMN "notionProp_e4b8496f87";

ALTER TABLE "Award" DROP COLUMN "notionId";

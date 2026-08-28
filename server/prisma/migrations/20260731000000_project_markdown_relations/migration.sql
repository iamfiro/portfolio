-- AlterTable
ALTER TABLE "Project" ADD COLUMN "content" TEXT;

-- AlterTable
ALTER TABLE "Award" ADD COLUMN "description" TEXT;

-- DropIndex
DROP INDEX "Award_projectId_key";

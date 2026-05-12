-- CreateTable
CREATE TABLE "Post" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PostProject" (
    "postSlug" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("postSlug", "projectId"),
    CONSTRAINT "PostProject_postSlug_fkey" FOREIGN KEY ("postSlug") REFERENCES "Post" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

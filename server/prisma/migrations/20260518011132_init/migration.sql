-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "githubUrl" TEXT,
    "deployUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notionProp_c4902d28e9" TEXT,
    "notionProp_a1c5c9ec45" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "thumbnailUrl" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "categories" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stack" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "notionProp_e4b8496f87" TEXT,
    "설명" TEXT,
    "카테고리" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostProject" (
    "postId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "PostProject_pkey" PRIMARY KEY ("postId","projectId")
);

-- CreateTable
CREATE TABLE "ProjectStack" (
    "projectId" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,

    CONSTRAINT "ProjectStack_pkey" PRIMARY KEY ("projectId","stackId")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_notionId_key" ON "Project"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_notionId_key" ON "Post"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Stack_notionId_key" ON "Stack"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Award_notionId_key" ON "Award"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Award_projectId_key" ON "Award"("projectId");

-- AddForeignKey
ALTER TABLE "PostProject" ADD CONSTRAINT "PostProject_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostProject" ADD CONSTRAINT "PostProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStack" ADD CONSTRAINT "ProjectStack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStack" ADD CONSTRAINT "ProjectStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "StorySource" AS ENUM ('JOURNALIST', 'AUTO', 'AI');

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "imageUrl" TEXT,
    "source" "StorySource" NOT NULL DEFAULT 'JOURNALIST',
    "category" TEXT,
    "region" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "authorId" TEXT,
    "approvedById" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_status_idx" ON "Story"("status");

-- CreateIndex
CREATE INDEX "Story_source_idx" ON "Story"("source");

-- CreateIndex
CREATE INDEX "Story_category_idx" ON "Story"("category");

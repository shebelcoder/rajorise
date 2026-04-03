-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "storyImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "storyImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Somalia',
ADD COLUMN     "district" TEXT,
ADD COLUMN     "region" TEXT NOT NULL DEFAULT 'Gedo',
ADD COLUMN     "village" TEXT;

-- CreateIndex
CREATE INDEX "Report_region_idx" ON "Report"("region");

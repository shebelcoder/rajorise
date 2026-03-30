-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_reportId_fkey";

-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "reportId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

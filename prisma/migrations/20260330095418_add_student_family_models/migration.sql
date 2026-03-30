-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "grade" TEXT,
    "location" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Somalia',
    "region" TEXT NOT NULL DEFAULT 'Gedo',
    "district" TEXT,
    "village" TEXT,
    "story" TEXT NOT NULL,
    "imageUrl" TEXT,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "raisedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "journalistId" TEXT NOT NULL,
    "approvedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" INTEGER,
    "location" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Somalia',
    "region" TEXT NOT NULL DEFAULT 'Gedo',
    "district" TEXT,
    "village" TEXT,
    "situation" TEXT,
    "story" TEXT NOT NULL,
    "need" TEXT,
    "imageUrl" TEXT,
    "phoneContact" TEXT,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "raisedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "journalistId" TEXT NOT NULL,
    "approvedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_slug_key" ON "Student"("slug");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");

-- CreateIndex
CREATE INDEX "Student_region_idx" ON "Student"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Family_slug_key" ON "Family"("slug");

-- CreateIndex
CREATE INDEX "Family_status_idx" ON "Family"("status");

-- CreateIndex
CREATE INDEX "Family_region_idx" ON "Family"("region");

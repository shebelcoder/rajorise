-- CreateTable
CREATE TABLE "Village" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'Gedo',
    "addedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Village_district_idx" ON "Village"("district");

-- CreateIndex
CREATE INDEX "Village_region_idx" ON "Village"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Village_name_district_region_key" ON "Village"("name", "district", "region");

/*
  Warnings:

  - You are about to drop the column `nearestUser` on the `SOS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SOS" DROP COLUMN "nearestUser",
ADD COLUMN     "policeId" INTEGER;

-- AddForeignKey
ALTER TABLE "SOS" ADD CONSTRAINT "SOS_policeId_fkey" FOREIGN KEY ("policeId") REFERENCES "Police"("id") ON DELETE SET NULL ON UPDATE CASCADE;

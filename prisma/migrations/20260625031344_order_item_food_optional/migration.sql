-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_foodId_fkey";

-- AlterTable
ALTER TABLE "order_item" ALTER COLUMN "foodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

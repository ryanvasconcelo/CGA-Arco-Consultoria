/*
  Warnings:

  - You are about to drop the column `companyproductId` on the `user_products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,companyProductId]` on the table `user_products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyProductId` to the `user_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_products" DROP CONSTRAINT "user_products_companyproductId_fkey";

-- DropIndex
DROP INDEX "public"."user_products_userId_companyproductId_key";

-- AlterTable
ALTER TABLE "public"."user_products" DROP COLUMN "companyproductId",
ADD COLUMN     "companyProductId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_products_userId_companyProductId_key" ON "public"."user_products"("userId", "companyProductId");

-- AddForeignKey
ALTER TABLE "public"."user_products" ADD CONSTRAINT "user_products_companyProductId_fkey" FOREIGN KEY ("companyProductId") REFERENCES "public"."company_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

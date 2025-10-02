-- DropForeignKey
ALTER TABLE "public"."company_products" DROP CONSTRAINT "company_products_companyId_fkey";

-- AddForeignKey
ALTER TABLE "public"."company_products" ADD CONSTRAINT "company_products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

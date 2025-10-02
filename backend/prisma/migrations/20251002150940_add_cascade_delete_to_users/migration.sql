-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_companyId_fkey";

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

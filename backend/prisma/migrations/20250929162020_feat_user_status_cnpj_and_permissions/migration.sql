-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_COMPANY', 'UPDATE_COMPANY', 'DELETE_COMPANY', 'ASSOCIATE_PRODUCT_TO_COMPANY', 'DISASSOCIATE_PRODUCT_FROM_COMPANY', 'ASSOCIATE_USER_TO_PRODUCT', 'DISASSOCIATE_USER_FROM_PRODUCT', 'ASSOCIATE_USER_TO_PERMISSION', 'DISASSOCIATE_USER_FROM_PERMISSION');

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "details" JSONB,
    "authorId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

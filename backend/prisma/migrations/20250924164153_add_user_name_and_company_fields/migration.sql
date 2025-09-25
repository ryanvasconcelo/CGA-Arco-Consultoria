/*
  Warnings:

  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#007bff';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "name" TEXT NOT NULL;

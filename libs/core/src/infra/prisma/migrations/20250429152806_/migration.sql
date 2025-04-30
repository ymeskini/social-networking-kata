-- AlterTable
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserFollows_AB_unique";

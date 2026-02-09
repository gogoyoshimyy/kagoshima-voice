/*
  Warnings:

  - You are about to drop the column `after` on the `ModerationLog` table. All the data in the column will be lost.
  - You are about to drop the column `before` on the `ModerationLog` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "etaMinutes" INTEGER NOT NULL,
    "providerLabel" TEXT NOT NULL,
    "evidenceTag" TEXT NOT NULL,
    "url" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Solution_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "IssueCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SolutionReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SolutionReaction_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SolutionReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ModerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ModerationLog_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ModerationLog" ("action", "createdAt", "id", "postId", "reviewer") SELECT "action", "createdAt", "id", "postId", "reviewer" FROM "ModerationLog";
DROP TABLE "ModerationLog";
ALTER TABLE "new_ModerationLog" RENAME TO "ModerationLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SolutionReaction_solutionId_userId_type_key" ON "SolutionReaction"("solutionId", "userId", "type");

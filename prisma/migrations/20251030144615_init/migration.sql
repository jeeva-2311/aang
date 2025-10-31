-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ApiEndpoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApiEndpoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "requestBody" JSONB,
    "headers" JSONB,
    "expectedStatus" INTEGER,
    "expectedBody" JSONB,
    "lastRunAt" DATETIME,
    "result" TEXT,
    CONSTRAINT "TestCase_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiEndpoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

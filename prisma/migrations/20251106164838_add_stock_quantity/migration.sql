-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceInPiasters" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isAvailableForPurchase" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'coffee',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "calories" INTEGER,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Product" ("calories", "category", "createdAt", "description", "featured", "filePath", "id", "imagePath", "isAvailableForPurchase", "name", "priceInPiasters", "updatedAt") SELECT "calories", "category", "createdAt", "description", "featured", "filePath", "id", "imagePath", "isAvailableForPurchase", "name", "priceInPiasters", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

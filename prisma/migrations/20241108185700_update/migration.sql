-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT DEFAULT '',
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "positionId" INTEGER,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOS" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "nearestUser" INTEGER,
    "contacts" TEXT,
    "email" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Police" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "Police_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hosbital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "Hosbital_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "Users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Users_positionId_key" ON "Users"("positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Police_positionId_key" ON "Police"("positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Hosbital_positionId_key" ON "Hosbital"("positionId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Police" ADD CONSTRAINT "Police_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hosbital" ADD CONSTRAINT "Hosbital_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

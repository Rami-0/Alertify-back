import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create positions for each police officer
  const position1 = await prisma.position.create({
    data: {
      latitude: 42.870789,
      longitude: 74.592221,
    },
  });

  const position2 = await prisma.position.create({
    data: {
      latitude: 42.857429,
      longitude: 74.568291,
    },
  });

  // Create police officers and link them to their positions
  await prisma.police.createMany({
    data: [
      {
        name: "Asylbekov Amanbek",
        isOnline: true,
        positionId: position1.id, // Link to the first position
      },
      {
        name: "Baktybekov Anuar",
        isOnline: true,
        positionId: position2.id, // Link to the second position
      },
    ],
  });

  // Create users
  await prisma.users.createMany({
    data: [
      {
        phoneNumber: "+1234567890",
        password: "hashedpassword1", // Make sure to hash passwords in real applications
        email: "user1@example.com",
        isConfirmed: true,
        name: "User One",
        role: "user",
      },
      {
        phoneNumber: "+0987654321",
        password: "hashedpassword2",
        email: "user2@example.com",
        isConfirmed: false,
        name: "User Two",
        role: "admin",
      },
      {
        phoneNumber: "+1122334455",
        password: "hashedpassword3",
        email: "user3@example.com",
        isConfirmed: true,
        name: "User Three",
        role: "user",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

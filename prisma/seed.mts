// import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcryptjs';
// import { ALL_MOVIES } from '@/data/movies'; // Import your movie data from a separate file

// const prisma = new PrismaClient();

// async function main() {
//   console.log("Starting database seed...");

//   // Create a test user first (required for movies)
//   const hashedPassword = await hash("Password123!", 12);

//   const user = await prisma.user.upsert({
//     where: { email: "test@example.com" },
//     update: {},
//     create: {
//       email: "test@example.com",
//       name: "Test User",
//       password: hashedPassword,
//     },
//   });

//   console.log("Created user:", user.email);

//   // Delete existing movies to avoid duplicates
//   await prisma.movie.deleteMany({
//     where: { userId: user.id },
//   });

//   // Create movies from mock data
//   for (const movieData of ALL_MOVIES.items) {
//     const movie = await prisma.movie.create({
//       data: {
//         ...movieData,
//         userId: user.id, // Associate each movie with the test user
//       },
//     });
//     console.log("Created movie:", movie.name);
//   }

//   console.log("Database seeding completed!");
// }

// main()
//   .catch((e) => {
//     console.error('Error seeding database:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
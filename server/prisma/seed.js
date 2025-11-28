import { prisma } from './client.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seeding for Spotter...');

  // 1. Clear the database (reverse order to respect Foreign Keys)
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');

  // 2. Create a generic hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('gymrat123', salt);

  // 3. Create 10 Users (Gym Bros & Girls)
  const users = [];
  const gymGoals = [
    'Hypertrophy',
    'Strength (Powerlifting)',
    'Fat loss',
    'Calisthenics',
    'Crossfit',
  ];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Coach'];

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    // Note: faker.internet.userName() may vary depending on the version,
    // use internet.username() in recent versions or userName() in older ones.
    const username =
      faker.internet.username({ firstName }).toLowerCase() +
      Math.floor(Math.random() * 100);

    const user = await prisma.user.create({
      data: {
        username,
        email: faker.internet.email({ firstName }),
        password: hashedPassword,
        bio: faker.lorem.sentence(),
        gymGoals: gymGoals[Math.floor(Math.random() * gymGoals.length)],
        experience: levels[Math.floor(Math.random() * levels.length)],
        avatarUrl: faker.image.avatar(),
      },
    });
    users.push(user);
  }
  console.log(`${users.length} users created.`);

  // 4. Create Posts
  const posts = [];
  const gymTopics = [
    'Leg day today and I can’t walk! 💀',
    'New bench PR: 100kg! Let’s go 💪',
    'Has anyone tried this brand’s creatine monohydrate?',
    'Post-workout recipe: Oats, whey, and banana. 🥞',
    'Active rest day. Important for growth.',
    'I hate Bulgarian split squats. End of statement.',
    'Looking for a workout partner for mornings.',
  ];

  for (const user of users) {
    const numPosts = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numPosts; j++) {
      const post = await prisma.post.create({
        data: {
          content: `${
            gymTopics[Math.floor(Math.random() * gymTopics.length)]
          } ${faker.lorem.sentence()}`,
          authorId: user.id,
        },
      });
      posts.push(post);
    }
  }
  console.log(`Posts created.`);

  // 5. Create Follows
  for (const user of users) {
    const randomUsers = users.filter((u) => u.id !== user.id);
    const followingCount = Math.floor(Math.random() * 3) + 1;

    const toFollow = randomUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, followingCount);

    for (const target of toFollow) {
      await prisma.follows.create({
        data: {
          followerId: user.id,
          followingId: target.id,
        },
      });
    }
  }
  console.log(`Follows created.`);
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

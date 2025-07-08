const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const slugify = require('slugify');

const prisma = new PrismaClient();

const eventDetails = [
  { name: 'Summer Music Festival', location: 'Central Park, New York', category: 'Music' },
  { name: 'Tech Conference 2024', location: 'Moscone Center, San Francisco', category: 'Technology' },
  { name: 'Art & Wine Fair', location: 'Napa Valley, California', category: 'Art & Culture' },
  { name: 'Charity Gala Dinner', location: 'The Plaza Hotel, New York', category: 'Charity & Causes' },
  { name: 'Startup Pitch Night', location: 'Silicon Valley, California', category: 'Business & Networking' },
  { name: 'Local Farmers Market', location: 'Union Square, New York', category: 'Food & Drink' },
  { name: 'Marathon for a Cause', location: 'Golden Gate Bridge, San Francisco', category: 'Sports & Fitness' },
  { name: 'Photography Workshop', location: 'Brooklyn, New York', category: 'Art & Culture' },
  { name: 'Book Club Meeting', location: 'The Strand Bookstore, New York', category: 'Family & Education' },
  { name: 'Yoga in the Park', location: 'Prospect Park, Brooklyn', category: 'Health & Wellness' },
  { name: 'Cooking Class: Italian Cuisine', location: 'Little Italy, New York', category: 'Food & Drink' },
  { name: 'Film Screening: Classic Cinema', location: 'Alamo Drafthouse, Austin', category: 'Art & Culture' },
  { name: 'Live Comedy Show', location: 'Comedy Cellar, New York', category: 'Art & Culture' },
  { name: 'Historical Walking Tour', location: 'Freedom Trail, Boston', category: 'Travel & Outdoor' },
  { name: 'DIY Craft Fair', location: 'Pioneer Square, Portland', category: 'Art & Culture' },
  { name: 'Tech Meetup: AI & Machine Learning', location: 'MIT, Cambridge', category: 'Technology' },
  { name: 'Outdoor Movie Night', location: 'Millennium Park, Chicago', category: 'Art & Culture' },
  { name: 'Food Truck Festival', location: 'Smorgasburg, Brooklyn', category: 'Food & Drink' },
  { name: 'Salsa Dancing Night', location: 'Miami, Florida', category: 'Health & Wellness' },
  { name: 'Charity Bike Ride', location: 'Lake Shore Drive, Chicago', category: 'Charity & Causes' },
  { name: 'Open Mic Night', location: 'The Gaslight Cafe, New York', category: 'Art & Culture' },
  { name: 'Gardening Workshop', location: 'Brooklyn Botanic Garden, New York', category: 'Health & Wellness' },
  { name: 'Science Fair for Kids', location: 'Museum of Science, Boston', category: 'Family & Education' },
  { name: 'Winter Holiday Market', location: 'Bryant Park, New York', category: 'Art & Culture' },
  { name: "New Year's Eve Celebration", location: 'Times Square, New York', category: 'Music' },
];

function createLongDescription() {
  return `${faker.lorem.paragraphs(4)}

${faker.lorem.paragraphs(1)}

${faker.lorem.paragraphs(1)}`;
}

async function main() {
  console.log('Seeding database...');

  try {
    // Clean up existing data
    await prisma.participant.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Cleaned up existing data.');

    // Create Categories
    const categoryNames = ['General Event', ...new Set(eventDetails.map((event) => event.category))];
    const categories = [];
    for (const name of categoryNames) {
      const category = await prisma.category.create({
        data: {
          name,
          slug: slugify(name, { lower: true }),
          imageUrl: faker.image.urlLoremFlickr({ category: 'event' }),
        },
      });
      categories.push(category);
    }
    console.log(`Created ${categories.length} categories.`);

    // Create Users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const password = await bcrypt.hash(`password${i + 1}`, 10);
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: password,
          avatarUrl: faker.image.avatar(),
        },
      });
      users.push(user);
    }
    console.log(`Created ${users.length} users.`);

    // Create Events
    const events = [];
    for (let i = 0; i < eventDetails.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const eventDetail = eventDetails[i];
      const category = categories.find((c) => c.name === eventDetail.category);
      const event = await prisma.event.create({
        data: {
          name: eventDetail.name,
          slug: slugify(eventDetail.name, { lower: true }),
          description: createLongDescription(),
          date: faker.date.future(),
          location: eventDetail.location,
          categoryId: category.id,
          userId: randomUser.id,
        },
      });
      events.push(event);
    }
    console.log(`Created ${events.length} events.`);

    // Create Participants
    const participants = [];
    for (const event of events) {
      // Each event will have between 1 and 5 participants
      const numParticipants = Math.floor(Math.random() * 5) + 1;
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numParticipants; i++) {
        if (shuffledUsers[i]) {
          // Avoid creating a participant record if the user is the event creator
          if (shuffledUsers[i].id !== event.userId) {
            const participant = await prisma.participant.create({
              data: {
                eventId: event.id,
                userId: shuffledUsers[i].id,
              },
            });
            participants.push(participant);
          }
        }
      }
    }
    console.log(`Created ${participants.length} participants.`);

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

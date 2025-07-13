import slugify from 'slugify';

import prisma from '@/utils/prisma';

export async function createEvent({ name, description, date, location, userId, categoryId }) {
  const slug = slugify(name, { lower: true, strict: true });
  return await prisma.event.create({
    data: {
      name,
      slug,
      description,
      date,
      location,
      userId,
      categoryId,
    },
  });
}

export async function getAllEvents() {
  return await prisma.event.findMany();
}

export async function getEventsByCategory(categorySlug) {
  return await prisma.event.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
  });
}

export async function getEvents(userId) {
  return await prisma.user.findMany({
    where: {
      userId,
    },
  });
}

export async function getEvent(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getEventBySlug(slug) {
  return await prisma.user.findUnique({
    where: {
      slug,
    },
  });
}

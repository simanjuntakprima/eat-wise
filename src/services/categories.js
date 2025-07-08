import prisma from '@/utils/prisma';

export async function getAllCategories() {
  return await prisma.category.findMany();
}

export async function getCategoryBySlug(slug) {
  return await prisma.category.findUnique({
    where: {
      slug,
    },
  });
}

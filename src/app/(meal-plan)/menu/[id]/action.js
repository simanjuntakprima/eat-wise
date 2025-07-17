'use server';

import prisma from '@/utils/prisma';

export async function getMealPlanHistoryDetail(mealPlanId) {
  const items = await prisma.mealPlanDetail.findMany({
    where: { mealPlanId },
    orderBy: { updatedAt: 'asc' },
  });

  console.log('ini item menu ya', items);
  return items;
}

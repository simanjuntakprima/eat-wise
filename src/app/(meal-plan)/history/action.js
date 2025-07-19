'use server';

import { getCurrentSession } from '@/services/auth';
import prisma from '@/utils/prisma';

export async function getMealPlanHistory({ page = 1, pageSize = 12 } = {}) {
  const userSession = await getCurrentSession();
  
  const skip = (page - 1) * pageSize;

  const where = { userId : userSession.userId};

  const items = await prisma.mealPlan.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.mealPlan.count({ where });

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

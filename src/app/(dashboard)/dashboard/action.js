'use server';

import prisma from '@/utils/prisma';
import { getCurrentSession } from '@/services/auth';

export async function getMealPlanUser() {
  const userSession = await getCurrentSession();

  const today = new Date();

  const plans = await prisma.mealPlan.findFirst({
    where: { userId: userSession.userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!plans) console.log('MealPlan not found');
  console.log(plans.id);

  const startDate = plans.startDate;
  const dayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const mealData = await prisma.MealPlanDetail.findMany({
    where: {
      mealPlanId: plans.id,
      day: dayIndex,
    },
  });

  return {
    ...mealData,
    plan: {
      id: plans.id,
      title: plans.title,
      days: plans.days,
      startDate: plans.startDate,
      endDate: plans.endDate,
      status: plans.status,
      dayIndex,
    },
  };
}

'use server';

import { getCurrentSession } from '@/services/auth';
import prisma from '@/utils/prisma';

export async function getMealPlanUser() {
  const userSession = await getCurrentSession();

  if (!userSession) return null;
  const today = new Date();

  const plans = await prisma.mealPlan.findFirst({
    where: { userId: userSession.userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!plans) {
    return null;
  }

  if (plans.endDate < today) {
    return null;
  }
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

export async function getMealPlanDetail(mealPlanId) {
  const mealPlanDetail = await prisma.MealPlanDetail.findFirst({
    where: { mealPlanId: mealPlanId },
  });

  return {
    ...mealPlanDetail,
  };
}

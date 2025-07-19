'use server';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { getCurrentSession } from '@/services/auth';
import { aiGeneration } from '@/trigger/tasks';
import prisma from '@/utils/prisma';

import { getRangeMealPlan, sanitizeCurrency } from './function';

export async function createMealPlan(formData) {
  const userSession = await getCurrentSession();

  const now = new Date();
  const formatted = format(now, 'eeee, dd MMMM yyyy HH:mm:ss');
  const budgetInput = sanitizeCurrency(formData.get('budget'));
  const budget = budgetInput;
  const days = String(formData.get('days'));
  const [startDate, endDate] = getRangeMealPlan(parseInt(days));

  const allergies = formData.get('allergies');
  const type = String(formData.get('type'));
  console.log('Type of cuisine:', type);

  const mealTimes = formData.getAll('mealTimes');
  const frequencyCount = mealTimes.length;

  if (!budget || !days || frequencyCount === 0) {
    return { success: false, message: 'Data wajib diisi tidak lengkap.' };
  }

  const inputGenerateMealPlan = `Create a meal plan with the following details:
Budget: Rp ${budget}
Duration: ${days} days
Frequency: ${mealTimes} meals per day
${allergies ? `Allergies: ${allergies}\n` : ''}Type of cuisine: ${type}`;
  console.log('Input for OpenAI:', inputGenerateMealPlan);

  const mealPlan = await prisma.mealPlan.create({
    data: {
      title: `Meal Plan For ${formatted}`,
      days: parseInt(days),
      userId: userSession.userId,
      budget: budget,
      allergies: allergies,
      cuisineCategories: type,
      startDate: startDate,
      endDate: endDate,
    },
    select: {
      id: true,
    },
  });

  const payloadTask = {
    mealPlanId: mealPlan.id.toString(),
    instruction: inputGenerateMealPlan,
    days: days,
    mealTimes: mealTimes,
    allergies: allergies,
  };

  await aiGeneration.trigger({ payloadTask });
  redirect('/dashboard');
}

export async function getMealPlanById(mealPlanId) {
  const userSession = await getCurrentSession();
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId, userId: userSession.userId },
  });
  return { ...mealPlan, budget: mealPlan.budget?.toNumber?.() || Number(mealPlan.budget) || 0 };
}

export async function checkActiveMealPlan() {
  try {
    const userSession = await getCurrentSession();
    const today = new Date();

    if (!userSession) redirect('/');

    const plans = await prisma.mealPlan.findFirst({
      where: { userId: userSession.userId, status: 'completed' },
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
    return { ...plans, budget: plans.budget?.toNumber?.() || Number(plans.budget) || 0 };
  } catch (error) {
    console.error('Error checking active meal plan:', error);
    return null;
  }
}

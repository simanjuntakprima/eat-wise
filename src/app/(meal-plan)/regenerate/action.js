'use server';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { getCurrentSession } from '@/services/auth';
import { aiGeneration } from '@/trigger/tasks';
import prisma from '@/utils/prisma';

import { getRangeMealPlan, sanitizeCurrency } from '../create/function';

export async function regenerateMealPlanUser(formData) {
  const userSession = await getCurrentSession();

  const existingMealPlanId = formData.get('existingMealPlanId');
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
  //delete existing meal plan
  const deleteResult = await deleteExistingMealPlan(existingMealPlanId, userSession.userId);
  console.log(deleteResult);
  // create new meal plan
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

export async function getMealPlanData(mealPlanId) {
  try {
    const [mealPlan, mealPlanDetail] = await prisma.$transaction([
      prisma.mealPlan.findFirst({
        where: { id: mealPlanId },
      }),
      prisma.mealPlanDetail.findFirst({
        where: { mealPlanId, day: 1 },
      }),
    ]);

    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }

    return {
      // Plan data
      ...mealPlan,
      budget: mealPlan.budget?.toNumber?.() || Number(mealPlan.budget) || 0,

      // Day 1 meal data
      ...(mealPlanDetail || {}),

      // Ensure these fields are included even if null
      cuisineCategories: mealPlan.cuisineCategories,
      allergies: mealPlan.allergies,
      days: mealPlan.days,
    };
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
}

export async function deleteExistingMealPlan(mealPlanId, userId) {
  try {
    await prisma.mealPlan.delete({
      where: { id: mealPlanId, userId: userId },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return { success: false, error: 'Failed to delete meal plan' };
  }
}

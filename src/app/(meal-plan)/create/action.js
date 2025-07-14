'use server';
import { format } from 'date-fns';
import { aiGeneration } from '@/trigger/tasks';
import prisma from '@/utils/prisma';
import { getCurrentSession } from '@/services/auth';

export async function createMealPlan(formData) {
  const userSession = await getCurrentSession();

  const now = new Date();
  const formatted = format(now, 'eeee, dd MMMM yyyy HH:mm:ss');

  const budget = formData.get('budget');
  const days = String(formData.get('days'));

  const allergies = formData.get('allergies') || 'tidak ada';
  const type = String(formData.get('type'));
  console.log('Type of cuisine:', type);

  const mealTimes = formData.getAll('mealTimes');
  const frequencyCount = mealTimes.length;

  if (!budget || !days || frequencyCount === 0) {
    return { success: false, message: 'Data wajib diisi tidak lengkap.' };
  }

  try {
    const inputGenerateMealPlan = `Create a meal plan with the following details:
    Budget: Rp ${budget}
    Duration: ${days} days
    Frequency: ${mealTimes} meals per day
    Allergies: ${allergies}
    Type of cuisine: ${type}`;
    console.log('Input for OpenAI:', inputGenerateMealPlan);

    const mealPlan = await prisma.mealPlan.create({
      data: {
        title: `Meal Plan For ${formatted}`,
        days: parseInt(days),
        userId:  userSession.userId,
        budget: budget,
        allergies: allergies,
        cuisineCategories: type,
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
  } catch (error) {
    console.error('Error in createMealPlan:', error);
    return {
      success: false,
      message: 'Error creating meal plan. Please try again later.',
    };
  }
}

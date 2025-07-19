import prisma from '@/utils/prisma';
import { logger } from '@trigger.dev/sdk/v3';

function response(body, statusCode) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: statusCode,
  });
}

export async function POST(request) {
  const body = await request.json();

  const { mealPlanId, days } = body;
  let response = null;

  try {
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      console.info('breakfast', day.breakfast);
      console.info('lunch', day.lunch);
      console.info('dinner', day.dinner);
      await prisma.mealPlanDetail.create({
        data: {
          mealPlanId,
          day: i + 1,
          breakfast: day.breakfast ?? null,
          lunch: day.lunch ?? null,
          dinner: day.dinner ?? null,
        },
      });
    }

    await prisma.mealPlan.update({
      where: {
        id: mealPlanId,
      },
      data: {
        status: 'completed',
      },
    });

    return new Response(
      JSON.stringify(
        { success: true, status: 'completed' },
        {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        },
      ),
    );
  } catch (error) {
    console.error('Error creating meal plan details:', error);
    return new Response(
      JSON.stringify(
        { success: false, error: error },
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      ),
    );
  }
}

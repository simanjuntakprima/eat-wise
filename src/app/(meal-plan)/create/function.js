import { PutObjectCommand } from '@aws-sdk/client-s3';

import { openai } from '@/utils/openai';
import prisma from '@/utils/prisma';
import { s3Client } from '@/utils/r2';

export default async function ProcessImagesMeals(mealName) {
  console.log(mealName);
  const mealImagePrompt = `Generate an image prompt for the dish with realistic photo-style, thumbnail quality, slightly blurred edges, low compression detail, e.g., A delicious ${mealName}`;
  const resultImg = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: mealImagePrompt,
    size: 'auto',
  });
  const folder = `images/${mealPlanId}`;
  const key = Date.now() + '.png';
  const buffer = Buffer.from(resultImg.data[0].b64_json, 'base64');
  const path = `https://pub-d4cfcc2a82524ddd85ba0e822aabc5c6.r2.dev/eatwise/images/${key}`;

  try {
    const fileUpload = await s3Client.send(
      new PutObjectCommand({
        Bucket: 'eatwise',
        Key: `${folder}/${key}`,
        Body: buffer,
        ContentType: 'image/png',
      }),
    );

    return { success: true, path };
    console.log('File uploaded successfully:', fileUpload);
    console.log('Image URL:', path);
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, message: 'Error uploading image.' };
  }
}

export async function getOrCreateMealId(recipeName, mealPlanId, mealType, allergies, mealIndex) {
  const recipeData = await prisma.recipe.findFirst({
    where: {
      name: {
        contains: recipeName,
        mode: 'insensitive',
      },
    },
  });

  console.log('Recipe Data', recipeData);

  if (recipeData) {
    return recipeData.id;
  } else {
    const newRecipe = await generateRecipe(recipeName, allergies);
    console.log('ini resepnya', newRecipe);
    const newRecipeData = await prisma.recipe.create({
      data: {
        name: recipeName,
        ingredients: newRecipe?.result?.ingredients,
        nutitionFacts: newRecipe?.result?.nutritionFacts,
        instructions: newRecipe?.result?.instructions,
      },
    });

    const newMeal = await prisma.meal.create({
      data: {
        recipeId: newRecipeData?.id,
        name: recipeName,
        type: mealType,
      },
    });

    return { success: true, mealId: newMeal.id.toString(), mealIndex };
  }
}

export async function generateRecipe(recipeName, allergies) {
  try {
    const input = JSON.stringify({
      recipeName: recipeName,
    });

    const result = await openai.responses.parse({
      model: 'gpt-4.1',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest recipe that contain ingridients, instructtion, and nutrition fact based on recipe name and avoid these ingredient ${allergies} because user allergy to that`,
      input: input,
      text: {
        format: {
          type: 'json_schema',
          strict: true,
          name: 'recipe',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              ingredients: { type: 'string' },
              nutritionFacts: { type: 'string' },
              instructions: { type: 'string' },
            },
            required: ['name', 'ingredients', 'nutritionFacts', 'instructions'],
            additionalProperties: false,
          },
        },
      },
    });
    console.log('Recipe Result:', result.output_parsed);
    return {
      success: true,
      result: result.output_parsed,
      headerData: input,
    };
  } catch (error) {
    console.error('Error in createRecipe:', error);
    return {
      success: false,
      message: 'Error creating recipe. Please try again later.',
    };
  }
}

export async function saveMealPlan(headerData, result) {
  for (let i = 0; i < result.days.length; i++) {
    const day = result.days[i];

    const mealPlan = await prisma.mealPlan.create({
      data: {
        title: `Meal Plan Day ${i + 1}`,
        days: i + 1,
        userId: 'cmcxgawpt0006hbilissxxk9r',
        budget: headerData?.budget ?? 0,
        allergies: headerData?.allergies ?? '-',
        cuisineCategories: headerData?.cuisineCategories ?? '-',
      },
    });

    const breakfastId = await getOrCreateMealId(day?.breakfast, mealPlan.id, 'breakfast');
    const lunchId = await getOrCreateMealId(day?.lunch, mealPlan.id, 'lunch');
    const dinnerId = await getOrCreateMealId(day?.dinner, mealPlan.id, 'dinner');

    await prisma.mealPlanDetail.create({
      data: {
        mealPlanId: mealPlan?.id,
        day: i + 1,
        breakfast: breakfastId ?? null,
        lunch: lunchId ?? null,
        dinner: dinnerId ?? null,
      },
    });
  }
}

export const generateMealPlanSchema = (daysCount, mealTimes) => {
  const mealSchema = {
    type: 'object',
    properties: {
      dishName: { type: 'string' },
      ingredients: { type: 'string' },
      instructions: { type: 'string' },
      imagePrompt: { type: 'string' },
    },
    required: ['dishName', 'ingredients', 'instructions', 'imagePrompt'],
    additionalProperties: false,
  };

  const perDaySchema = Object.fromEntries(mealTimes.map((time) => [time, { ...mealSchema }]));

  const daysArray = Array.from({ length: daysCount }).map(() => ({
    type: 'object',
    properties: perDaySchema,
    required: mealTimes,
    additionalProperties: false,
  }));

  return {
    type: 'json_schema',
    strict: true,
    name: 'meal_plan',
    schema: {
      type: 'object',
      properties: {
        days: {
          type: 'array',
          items: daysArray,
        },
      },
      required: ['days'],
      additionalProperties: false,
    },
  };
};

export function sanitizeCurrency(inputString) {
  return parseInt(inputString.replace(/\D/g, ''), 10);
}

export function getRangeMealPlan(duration) {
  const now = new Date();
  console.log('duration ', duration);
  const startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endDate = new Date(startDateTime);
  endDate.setDate(endDate.getDate() + duration);

  const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
  return [startDateTime, endDateTime];
}

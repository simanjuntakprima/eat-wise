import { logger, task, wait } from '@trigger.dev/sdk/v3';
import { openai } from '@/utils/openai';
import prisma from '@/utils/prisma';
import { getOrCreateMealId, processImagesMeals } from '@/app/(meal-plan)/create/function';
export const aiGeneration = task({
  id: 'ai-generation',
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 3600, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    console.log('Received payload:', payload.payloadTask.instruction);
    console.log('Meal Plan Id', payload.payloadTask.mealPlanId);
    logger.log('Starting AI meal plan generation task', payload.inputGenerateMealPlan);
    const inputInstruction = payload.payloadTask.instruction;
    const result = await openai.responses.parse({
      model: 'gpt-4o',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints. Please provide only the cuisine title in short make the result in bahasa`,
      input: inputInstruction,
      text: {
        format: {
          type: 'json_schema',
          strict: true,
          name: 'meal_plan',
          schema: {
            type: 'object',
            properties: {
              days: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    breakfast: { type: ['string', 'null'] },
                    lunch: { type: ['string', 'null'] },
                    dinner: { type: ['string', 'null'] },
                  },
                  required: ['breakfast', 'lunch', 'dinner'],
                  additionalProperties: false,
                },
              },
            },
            required: ['days'],
            additionalProperties: false,
          },
        },
      },
    });
    logger.log('Meal Plan Result:', result.output_parsed);

    const meals = [];
    const processImageTasks = [];
    const processMealTasks = [];

    for (const [index, day] of result.output_parsed.days.entries()) {
      for (const [mealType, mealValue] of Object.entries(day)) {
        const dayNumber = index + 1;
        const mealIndex = `${dayNumber}-${mealType}`;

        logger.log(`Processing ${mealType} for day ${day}:`, mealValue);
        meals.push({ mealType, day: dayNumber, mealIndex });

        if (mealValue) {
          logger.log(`Processing image for ${mealType}:`, mealValue);
          processImageTasks.push(processImagesMeals(mealValue, mealIndex));
          processMealTasks.push(
            getOrCreateMealId(
              mealValue,
              payload.payloadTask.mealPlanId,
              mealType,
              payload.payloadTask.allergies,
              mealIndex,
            ),
          );
        }
      }
    }

    const results = await Promise.allSettled(processImageTasks);
    logger.log('Processed Image Results:', results);

    const resultsMeal = await Promise.allSettled(processMealTasks);
    logger.log('Processed Meal Results:', resultsMeal);

    const imagePathToDayMealType = {};
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { success, path, mealIndex } = result.value;
        if (success) {
          imagePathToDayMealType[mealIndex] = path;
        }
      }
    });

    const mealsWithImages = meals.map((meal, index) => {
      const imagePath = imagePathToDayMealType[meal.mealIndex] || null;

      return {
        ...meal,
        imagePath,
      };
    });

    logger.log('Processing meals:', mealsWithImages);
    return mealsWithImages;
  },
});

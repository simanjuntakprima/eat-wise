import { logger, task } from '@trigger.dev/sdk/v3';

import { getOrCreateMealId, processImagesMeals } from '@/app/(meal-plan)/create/function';
import { openai } from '@/utils/openai';
import prisma from '@/utils/prisma';
export const aiGeneration = task({
  id: 'ai-generation',
  maxDuration: 3600,
  run: async (payload) => {
    const mealTimes = payload.payloadTask.mealTimes;
    const mealSchema = {
      type: 'object',
      properties: {
        dishName: { type: 'string' },
        ingredients: { type: 'string' },
        instructions: { type: 'string', description: 'this is a instruction or recipe for the dish' },
        imagePrompt: { type: 'string', description: 'this is a image prompt for the dish' },
      },
      required: ['dishName', 'ingredients', 'instructions', 'imagePrompt'],
      additionalProperties: false,
    }

    const allMealSchema = mealTimes.map((time) => {
      return {
        [time]: { ...mealSchema },
      };
    })

    const prepareSchema = {
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
              properties: {...allMealSchema},
              required: [...mealTimes],
              additionalProperties: false,
            },
          },
        },
        required: ['days'],
        additionalProperties: false,
      },
    }

    const inputInstruction = payload.payloadTask.instruction;
    const result = await openai.responses.parse({
      model: 'gpt-4o',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints. Please provide only the cuisine title in short make the result in bahasa`,
      input: inputInstruction,
      text: {
        format: prepareSchema
      },
    });
    
    const mealId = payload.payloadTask.mealPlanId;

    const allImagePrompt = result.output_parsed.days.map(day => ({
      day: day.day,
      breakfastImagePrompt: day.breakfast.imagePrompt,
      lunchImagePrompt: day.lunch.imagePrompt,
      dinnerImagePrompt: day.dinner.imagePrompt,
    }))

    return { mealId, allImagePrompt }
  },
});

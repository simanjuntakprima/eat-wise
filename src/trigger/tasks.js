import { logger, task, wait } from '@trigger.dev/sdk/v3';
import { openai } from '@/utils/openai';
import ProcessImagesMeals from '@/app/(meal-plan)/create/function';
export const aiGeneration = task({
  id: 'ai-generation',
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 3600, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    console.log('Received payload:', payload.inputGenerateMealPlan);
    logger.log('Starting AI meal plan generation task', payload.inputGenerateMealPlan);
    const result = await openai.responses.parse({
      model: 'gpt-4o',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints. Please provide only the cuisine title in short make the result in bahasa`,
      input: payload.inputGenerateMealPlan,
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
                    breakfast: { type: 'string' },
                    lunch: { type: 'string' },
                    dinner: { type: 'string' },
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

    for (const [_, day] of result.output_parsed.days.entries()) {
      for (const [mealType, mealValue] of Object.entries(day)) {
        logger.log(`Processing ${mealType} for day ${day}:`, mealValue);
        await ProcessImagesMeals(mealValue);
      }
    }
  },
});

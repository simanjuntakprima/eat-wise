import { logger, task } from '@trigger.dev/sdk/v3';

import { openai } from '@/utils/openai';

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
    };

    const allMealSchema = Object.fromEntries(mealTimes.map((time) => [time, { ...mealSchema }]));

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
              properties: { ...allMealSchema },
              required: [...mealTimes],
              additionalProperties: false,
            },
          },
        },
        required: ['days'],
        additionalProperties: false,
      },
    };

    const inputInstruction = payload.payloadTask.instruction;
    const result = await openai.responses.parse({
      model: 'gpt-4.1',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints and give variety type of food in each day. Please provide only the cuisine title in short also please be mind these rules and if its not parsing allergies data also 
      it means that user have no allergies, please mind of that rule 
      - Ingredients must be listed as a numbered list.
      - Instructions must be listed as a numbered cooking guide.
      - response is in bahasa`,
      input: inputInstruction,
      text: {
        format: prepareSchema,
      },
    });

    logger.info('result meal plan', result.output_parsed);
    logger.info('result meal plan length arr', result.output_parsed.days.length);
    const mealPlanId = payload.payloadTask.mealPlanId;
    const days = result.output_parsed.days;

    const createMealPlanDetailPayload = {
      mealPlanId,
      days,
    };
    logger.info('task payload', createMealPlanDetailPayload);

    try {
      const response = await fetch(`${process.env.API_BASE_URL}/api/create-meal-plan-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createMealPlanDetailPayload),
      });

      const data = await response.json();

      if (!data.success) {
        logger.error('Failed to create meal plan detail', response.error);
        return;
      }

      logger.info('Meal plan detail created successfully', data);
    } catch (error) {
      logger.error('Error creating meal plan detail', error);
    }
  },
});

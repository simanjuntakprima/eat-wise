import { logger, task } from '@trigger.dev/sdk/v3';
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
    };

    // const generatedSchema = generateMealPlanSchema(payload.payloadTask.days.days, mealTimes);
    // logger.info('Generate schema ', generatedSchema);
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
      model: 'gpt-4o',
      instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints. Please provide only the cuisine title in short also please be mind these rules 
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
    try {
      for (let i = 0; i < result.output_parsed.days.length; i++) {
        const day = result.output_parsed.days[i];
        logger.info('breakfast', day.breakfast);
        logger.info('lunch', day.lunch);
        logger.info('dinner', day.dinner);
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
    } catch (error) {
      logger.error('Error inserting to db plan detail');
      throw error;
    }
    return mealPlanId;
  },
});

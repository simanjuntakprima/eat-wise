'use server';
import { aiGeneration } from '@/trigger/tasks';
import { openai } from '@/utils/openai';
import { s3Client } from '@/utils/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function createMealPlan(formData) {
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

  // try {
  const inputGenerateMealPlan = `Create a meal plan with the following details:
     Budget: Rp ${budget}
     Duration: ${days} days
     Frequency: ${mealTimes} meals per day
     Allergies: ${allergies}
     Type of cuisine: ${type}`;
  console.log('Input for OpenAI:', inputGenerateMealPlan);
  await aiGeneration.trigger({ inputGenerateMealPlan });

  //   const result = await openai.responses.parse({
  //     model: 'gpt-4o',
  //     instructions: `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints. Please provide only the cuisine title in short make the result in bahasa`,
  //     input: input,
  //     text: {
  //       format: {
  //         type: 'json_schema',
  //         strict: true,
  //         name: 'meal_plan',
  //         schema: {
  //           type: 'object',
  //           properties: {
  //             days: {
  //               type: 'array',
  //               items: {
  //                 type: 'object',
  //                 properties: {
  //                   breakfast: { type: 'string' },
  //                   lunch: { type: 'string' },
  //                   dinner: { type: 'string' },
  //                 },
  //                 required: ['breakfast', 'lunch', 'dinner'],
  //                 additionalProperties: false,
  //               },
  //             },
  //           },
  //           required: ['days'],
  //           additionalProperties: false,
  //         },
  //       },
  //     },
  //   });
  //   console.log('Meal Plan Result:', result.output_parsed);

  //   return {
  //     success: true,
  //     result: result.output_parsed,
  //   };
  // } catch (error) {
  //   console.error('Error in createMealPlan:', error);
  //   return {
  //     success: false,
  //     message: 'Error creating meal plan. Please try again later.',
  //   };
  // }
}

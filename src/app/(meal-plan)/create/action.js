'use server';

import { openai } from '@/utils/openai';
import { fr } from '@faker-js/faker/.';

export async function createMealPlan(formData) {
  const budget = formData.get('budget');
  const days = formData.get('days');

  const allergies = formData.get('allergies') || 'tidak ada';
  const type = formData.get('type') || 'tidak ada preferensi khusus';

  const mealTimes = formData.getAll('mealTimes');
  const frequencyCount = mealTimes.length;

  console.log('Meal Times:', mealTimes);

  if (!budget || !days || frequencyCount === 0) {
    return { success: false, message: 'Data wajib diisi tidak lengkap.' };
  }
  const frequency = formData.get('frequency');

  const instructions = `You are a smart meal planning assistant designed for users who want to eat healthy, save time, and stay within their budget. Suggest weekly meal plans based on the user's dietary preferences, calorie goals, cooking time availability, and budget constraints.

Your response must follow the format below:

EXAMPLE RESPONSE:

## WEEK Overview  
- Calorie Target: [e.g. 1800/day]  
- Dietary Preference: [e.g. Vegan, Pescatarian, etc.]  
- Budget: [e.g. IDR 400K]  
- Cooking Time: [e.g. ~30 min/day]  

# Day 1  
## BREAKFAST  
### Dish Name: [Dish Name]  
### Ingredients:  
- [Ingredient 1]  
- [Ingredient 2]  
- ...  
### How to Cook:  
[Step-by-step cooking instructions]

## LUNCH  
### Dish Name: [Dish Name]  
### Ingredients:  
- ...  
### How to Cook:  
...

## DINNER  
### Dish Name: [Dish Name]  
### Ingredients:  
- ...  
### How to Cook:  
...

# Day 2  
...continue with the same structure for each day of the week.

Include weekly prep tips, nutrition facts if relevant, smart grocery lists at the end, and offer friendly suggestions like leftovers ideas or meal swaps. Keep the tone warm and helpful.
   `;
  try {
    // const mealPlan = await prisma.mealPlan.create({
    //   data: {
    //     budget: parseInt(budget),
    //     days: parseInt(days),
    //     frequency: parseInt(frequency),
    //     allergies,
    //     type,
    //   },
    // });
    const input = `Create a meal plan with the following details: budget: Rp ${budget}, duration: ${days} days, frequency: ${mealTimes} meals per day, allergies: ${allergies}, type of cuisine is: ${type}.`;


    const result = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions,
      input,
    });

    console.log('Meal Plan Result:', result.output_text);
    return {
      success: true,
      result: result.output_text,
    };
  } catch (error) {
    console.error('Error in createMealPlan:', error);
    return {
      success: false,
      message: 'Error creating meal plan. Please try again later.',
    };
  }
}

'use server';

import openai from '@utils/openai';

export async function mealPlan(formData) {
    const message =  formData.get('message');

    const res = await openai.responses.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant who helps generate personalized meal plans.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return res.choices[0].message.content;
}

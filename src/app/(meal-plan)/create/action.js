'use server';

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createMealPlan(formData) {
  const budget = formData.get('budget');
  const days = formData.get('days');
  const allergies = formData.get('allergies') || 'tidak ada';
  const type = formData.get('type') || 'tidak ada preferensi khusus';

  const mealTimes = formData.getAll('mealTimes');
  const frequencyCount = mealTimes.length; //

  if (!budget || !days || frequencyCount === 0) {
    return { success: false, message: 'Data wajib diisi tidak lengkap.' };
  }

  try {
    const promptMessage = `
      Buatkan saya meal plan untuk ${days} hari.
      Budget saya adalah Rp ${budget}.
      Saya ingin makan ${frequencyCount} kali sehari, yaitu saat: ${mealTimes.join(', ')}.
      Alergi makanan yang saya miliki: ${allergies}.
      Preferensi makanan saya: ${type}.
      Tolong berikan hasilnya dalam format yang rapi dan mudah dibaca.
    `;

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant who helps generate personalized meal plans based on Indonesian cuisine and budget.',
        },
        {
          role: 'user',
          content: promptMessage,
        },
      ],
    });

    const aiResponse = res.choices[0].message.content;

    await prisma.mealPlan.create({
      data: {
        budget: parseInt(budget),
        days: parseInt(days),
        frequency: frequencyCount,
        allergies: formData.get('allergies'),
        type: formData.get('type'),
      },
    });

    return {
      success: true,
      aiMealPlan: aiResponse,
    };
  } catch (error) {
    console.error('Error in createMealPlan:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan pada server.',
    };
  }
}

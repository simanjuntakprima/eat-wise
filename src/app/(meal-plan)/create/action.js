'use server';

export async function createMealPlan(formData) {
  const budget = formData.get('budget');
  const days = formData.get('days');
  const frequency = formData.get('frequency');
  const allergies = formData.get('allergies') || '';
  const type = formData.get('type') || '';

  try {
    const mealPlan = await prisma.mealPlan.create({
      data: {
        budget: parseInt(budget),
        days: parseInt(days),
        frequency: parseInt(frequency),
        allergies,
        type,
      },
    });

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

    return {
      success: true,
      message: 'Meal plan berhasil disimpan!',
      mealPlan,
    };
  } catch {
    return {
      success: false,
      error: 'Terjadi kesalahan saat menyimpan ke database.',
    };
  }
}

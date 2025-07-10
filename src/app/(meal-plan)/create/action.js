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

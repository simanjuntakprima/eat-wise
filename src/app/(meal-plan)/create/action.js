'use server';

export async function createMealPlan(_, formData) {
  const budget = Number(formData.get('budget'));
  const days = formData.get('days');
  const makan = formData.get('makan');
  const alergi = formData.get('alergi');
  const type = formData.get('type');

  const errors = {};

  if (isNaN(budget) || budget < 10000) {
    errors.budget = 'Budget minimal Rp 10.000';
  }

  if (!hari) errors.days = 'Wajib pilih hari';
  if (!makan) errors.makan = 'Wajib pilih jumlah makan';
  if (!type) errors.foodType = 'Wajib pilih tipe makanan';

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Lanjut simpan / proses data
  return {
    success: true,
    data: { budget, days, makan, alergi, type },
  };
}

import { getMealPlanUser } from '@/app/(dashboard)/dashboard/action';
export async function GET() {
  const mealPlan = await getMealPlanUser();
  if (!mealPlan) return true;
  else return false;
}

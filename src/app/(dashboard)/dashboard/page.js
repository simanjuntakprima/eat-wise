import DashboardEmpty from '@/app/(app)/_components/emptyMealPlan';
import { getMealPlanUser } from './action';
import DashboardClient from './DashboardClient';
export default async function Dashboard() {
  const mealPlanUser = await getMealPlanUser();

  if (!mealPlanUser) return <DashboardEmpty></DashboardEmpty>;

  const mealData = mealPlanUser['0'];
  const plan = mealPlanUser.plan;

  return <DashboardClient mealData={mealData} plan={plan} />;
}

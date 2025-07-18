import { getMealPlanUser } from './action';
import DashboardClient from './DashboardClient';
export default async function Dashboard() {
  const mealPlanUser = await getMealPlanUser();
  const mealData = mealPlanUser['0'];
  const plan = mealPlanUser.plan;

  return <DashboardClient mealData={mealData} plan={plan} />;
}

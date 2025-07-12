import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const getMealPlans = async () => {
  return [
    { id: '1', createdAt: new Date('2025-07-07') },
    { id: '2', createdAt: new Date('2025-07-07') },
    { id: '3', createdAt: new Date('2025-07-07') },
    { id: '4', createdAt: new Date('2025-07-07') },
    { id: '5', createdAt: new Date('2025-07-07') },
    { id: '6', createdAt: new Date('2025-07-07') },
    { id: '7', createdAt: new Date('2025-07-07') },
    { id: '8', createdAt: new Date('2025-07-07') },
    { id: '9', createdAt: new Date('2025-07-07') },
  ];
};

export default async function DashboardPage() {
  const mealPlans = await getMealPlans();

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">My Meal Plans</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mealPlans.map((plan) => (
          <Card key={plan.id} className="border-none bg-[#F2EAD3] transition-shadow hover:shadow-lg">
            <CardContent className="p-4">
              <Button asChild variant="ghost" className="h-full w-full text-center">
                <Link href="/menu">
                  <div className="flex flex-col">
                    <span>Meal plan</span>
                    <span>{formatDate(plan.createdAt)}</span>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

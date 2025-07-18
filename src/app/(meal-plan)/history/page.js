import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getMealPlanHistory } from './action';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import DashboardEmpty from '@/app/(app)/_components/emptyMealPlan';

export default async function HistoryPage({ searchParams = {} }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const { items: mealPlanHist, total } = await getMealPlanHistory({
    page,
    pageSize,
  });
  if (mealPlanHist === 0) {
    return <DashboardEmpty></DashboardEmpty>;
  }
  console.log('Meal Plan History', mealPlanHist);
  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">My Meal Plans</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mealPlanHist.map((plan) => (
          <Card key={plan.id} className="border-none bg-[#F2EAD3] hover:shadow-lg">
            <CardContent className="p-4">
              <Button asChild variant="ghost" className="h-full w-full text-center">
                <Link href={`menu/${plan.id}`}>
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

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink href={`?page=${i + 1}`} isActive={i + 1 === page}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={`?page=${page < totalPages ? page + 1 : totalPages}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

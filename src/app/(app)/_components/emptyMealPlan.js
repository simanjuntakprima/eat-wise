'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function DashboardEmpty() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push('/create');
  };

  return (
    <div className="rounded-xl bg-[#F2EAD3] p-6">
      <div className="mx-auto max-w-4xl rounded-lg bg-[#F5F5F5] p-6 shadow">
        <h3>{"You don't have a Meal-Plan yet. Please create  Meal-Plan by using button below❗"}</h3>

        <div className="mt-6">
          <Button
            onClick={handleRedirect}
            className="rounded bg-gradient-to-b from-[#FAF8F4]/90 to-[#C7B590]/90 px-4 py-2 text-[#1C1C1C] hover:bg-[#998D6D]"
          >
            {"Let's Make It!"}
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function GenerateMealButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/check-meal-plan');
    const data = await res.json();

    if (false) {
      toast({
        variant: 'destructive',
        title: 'Rencana masih berjalan',
        description: 'Kamu tidak bisa membuat rencana makan baru sekarang.',
      });
    } else {
      router.push('/create');
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md bg-[#DED2B3] px-5 py-2 text-sm font-semibold text-[#1C1C1C] shadow-md transition duration-300 hover:bg-[#bda16d] active:scale-[0.98]"
    >
      {loading ? 'Checking...' : 'Generate Meal Plan'}
    </button>
  );
}

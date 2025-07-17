'use client';

import { useState, useEffect } from 'react';
import FoodModal from '@/app/(meal-plan)/menu/foodModal';

function getMealImage(type) {
  switch (type) {
    case 'breakfast':
      return 'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?q=80&w=776&auto=format&fit=crop';
    case 'lunch':
      return 'https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?q=80&w=880&auto=format&fit=crop';
    case 'dinner':
    default:
      return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop';
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState(null);
  const [planMeta, setPlanMeta] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/meal-today', { cache: 'no-store' });
        const data = await res.json();
        if (ignore) return;

        if (res.ok && data.mealData) {
          setMealData(data.mealData);
          setPlanMeta(data.plan);
          setServerMessage(data.message);
        } else {
          setMealData(null);
          setPlanMeta(null);
          setServerMessage(data.error || data.message || 'Failed to load meal plan.');
        }
      } catch (err) {
        if (!ignore) setServerMessage('Network error.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const noData =
    !mealData || (mealData.breakfast?.length === 0 && mealData.lunch?.length === 0 && mealData.dinner?.length === 0);

  const handleShare = async () => {
    const dayText = planMeta ? `Day ${planMeta.dayNumber}/${planMeta.days}` : 'today';
    const shareData = {
      title: 'My Meal Plan',
      text: `Check out my meal plan (${dayText})!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert('Meal Plan shared successfully!');
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const renderDateRange = () => {
    if (!planMeta) return null;
    const fmt = (d) => new Date(d).toLocaleDateString();
    return (
      <p className="mt-2 text-sm text-gray-600">
        {fmt(planMeta.startDate)} – {fmt(planMeta.endDate)}
      </p>
    );
  };

  return (
    <div className="px-4 py-10">
      {loading ? (
        <p className="text-red-700">We are cooking your Meal Plan, wait . . .</p>
      ) : planMeta ? (
        <p className="font-semibold text-red-700">
          Your Meal Plan (Day {planMeta.dayNumber}/{planMeta.days}) is ready, check it out!
        </p>
      ) : (
        <p className="font-semibold text-gray-500">{serverMessage || 'No active meal plan.'}</p>
      )}

      {!loading && renderDateRange()}

      {!loading && (
        <div className="mt-8 flex justify-between">
          {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
            const key = mealType.toLowerCase(); 
            const items = mealData?.[key] ?? [];
            const img = getMealImage(key); 

            return (
              <div key={mealType} className="w-[30%] text-center">
                <h2 className="mb-4 text-xl font-semibold">{mealType}</h2>
                <div className="grid gap-3">
                  {items.length === 0 ? (
                    <div className="flex h-44 items-center justify-center rounded-lg bg-[#fef5dd] text-sm text-gray-500">
                      No {mealType} item.
                    </div>
                  ) : (
                    items.map((meal, index) => (
                      <div
                        key={index}
                        className="relative h-44 cursor-pointer overflow-hidden rounded-lg bg-[#fef5dd] shadow-md"
                        onClick={() => {
                          setSelectedMeal({ title: `${mealType} - ${meal.title}`, image: img });
                          setIsOpen(true);
                        }}>
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${img})` }}/>
                        <div className="bg-opacity-30 absolute inset-0 bg-black" />
                        <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
                          <h3 className="text-xl font-semibold">{mealType}</h3>
                        </div>
                        <p className="mt-2 text-center text-sm font-medium text-gray-700">{meal.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="mt-10">
          <button
            onClick={handleShare}
            disabled={noData}
            className="rounded-lg bg-[#4E3636] px-5 py-2 text-base text-white shadow-md transition hover:bg-[#857e6b] disabled:opacity-50">
            Share Meal Plan
          </button>
          {noData && <p className="mt-2 text-sm text-gray-500">No meal data available.</p>}
        </div>
      )}

      {selectedMeal && <FoodModal isOpen={isOpen} currentFood={selectedMeal} closeModal={() => setIsOpen(false)} />}
    </div>
  );
}

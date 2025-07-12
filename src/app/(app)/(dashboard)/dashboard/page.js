'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FoodModal from '@/src/app/(meal-plan)/menu/foodModal';


export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setMealData({
        breakfast: ['Loading...', 'Loading...'],
        lunch: ['Loading...', 'Loading...'],
        dinner: ['Loading...', 'Loading...'],
      });
      setLoading(false);
    }, 2000);
  }, []);

  const handleRedirect = () => {
    router.push('/(meal-plan)/foodModal.js');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Meal Plan',
      text: 'Check out my meal plan for today!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert('Meal Plan shared successfully!');
      } catch (error) {
        console.error('Share failed:(', error);
      }
    }
  };

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 py-10">
      {loading ? (
        <p className="text-red-700" onClick={handleRedirect}>
          Weare cooking for your Meal Plan, wait . . .{' '}
        </p>
      ) : (
        <p className="cursor-pointer font-semibold text-red-700">Your Meal Plan is ready, check it out!</p>
      )}

      <div className="mt-8 flex justify-between">
        {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
          <div key={mealType} className="w-[30%] text-center">
            <h2 className="mb-4 text-xl font-semibold">{mealType}</h2>
            <div className="grid gap-3">
              {mealData &&
                mealData[mealType.toLowerCase()].map((img, index) => (
                  <div
                    key={index}
                    className="h-44 cursor-pointer overflow-hidden rounded-lg bg-[#fef5dd]"
                    onClick={() => {
                      setSelectedMeal({
                        title: `${mealType} - Menu ${index + 1}`,
                        image: mealData[mealType.toLowerCase()][index],
                      });
                      setIsOpen(true);
                    }}
                  ></div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <div className="mt-10">
          <button
            onClick={handleShare}
            className="rounded-lg bg-[#4E3636] px-5 py-2 text-base text-white shadow-md transition hover:bg-[#857e6b]"
          >
            Share Meal Plan
          </button>
        </div>
      )}

      {selectedMeal && <FoodModal isOpen={isOpen} currentFood={selectedMeal} closeModal={() => setIsOpen(false)} />}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FoodModal from '@/app/(meal-plan)/menu/foodModal';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setMealData({
        breakfast: [
          {
            image:
              'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Avocado Toast with Poached Egg',
          },
        ],
        lunch: [
          {
            image:
              'https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Grilled Chicken with Quinoa Salad',
          },
        ],
        dinner: [
          {
            image:
              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Salmon with Roasted Vegetables',
          },
        ],
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
                mealData[mealType.toLowerCase()].map((meal, index) => (
                  <div
                    key={index}
                    className="relative h-44 cursor-pointer overflow-hidden rounded-lg bg-[#fef5dd] shadow-md"
                    onClick={() => {
                      setSelectedMeal({
                        title: `${mealType} - ${meal.title}`,
                        image: meal.image,
                      });
                      setIsOpen(true);
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${meal.image})` }}
                    />

                    <div className="bg-opacity-30 absolute inset-0 bg-black" />

                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
                      <h3 className="text-xl font-semibold">{mealType}</h3>
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-gray-700">{meal.title}</p>
                  </div>
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

      {selectedMeal && (
        <FoodModal isOpen={isOpen} currentFood={selectedMeal} closeModal={() => setIsOpen(false)} />
      )}
    </div>
  );
}

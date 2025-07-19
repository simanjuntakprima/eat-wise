'use client';
import React from 'react';
import { useEffect, useState } from 'react';

import FoodModal from '@/app/(app)/_components/foodModal';
import { RegenerateButton } from '@/app/(app)/_components/RegenerateButton';
import { getMealPlanById } from '@/app/(meal-plan)/create/action';
import { getMealImage } from '@/app/utils/prepareMealJson';

import { getMealPlanDetail } from './action';
export default function DashboardClient({ initialMealData, initialPlan }) {
  const [openModal, setOpenModal] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  console.log('initialPlan', initialPlan);
  const [isLoading, setIsLoading] = useState(initialPlan.status === 'processing');
  const [mealData, setMealData] = useState(initialMealData);
  const [plan, setPlan] = useState(initialPlan);

  const checkMealPlanStatus = async () => {
    try {
      const data = await getMealPlanById(initialPlan.id);

      if (data.status !== plan.status) {
        setPlan((prev) => ({ ...prev, status: data.status }));
      }

      if (data.status === 'completed') {
        const mealData = await getMealPlanDetail(initialPlan.id);
        setMealData(mealData);
        setIsLoading(false);
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error('Error checking meal plan status:', error);
    }
  };
  const intervalRef = React.useRef();

  useEffect(() => {
    if (plan.status === 'processing') {
      // Check immediately and then every 5 seconds
      checkMealPlanStatus();
      intervalRef.current = setInterval(checkMealPlanStatus, 5000);

      return () => clearInterval(intervalRef.current);
    }
  }, [plan.status]);

  const handleRegenerate = async (mealPlanId) => {
    try {
      setIsLoading(true);
      console.log('Regenerating meal plan:', mealPlanId);
      await regenerateMealPlan(mealPlanId);
    } catch (error) {
      console.error('Regeneration failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(plan.status === 'processing');
  }, [plan.status]);

  return (
    <div className="px-4 py-10">
      <h1 className="text-xl font-semibold">{plan.title}</h1>
      <p>
        Day {plan.dayIndex} of {plan.days}
      </p>

      {isLoading ? (
        <div className="mt-8">
          <p className="py-10 text-center">Your meal plan is being generated...</p>
          <div className="flex animate-pulse justify-between">
            <div className="h-40 w-1/3 rounded-lg bg-gray-200"></div>
            <div className="mx-4 h-40 w-1/3 rounded-lg bg-gray-200"></div>
            <div className="h-40 w-1/3 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 flex justify-between">
            {mealData?.breakfast?.dishName && (
              <section
                onClick={() => setOpenModal({ ...openModal, breakfast: true })}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <label className="block text-sm font-medium text-gray-700">Breakfast</label>
                {getMealImage('breakfast')}
                <h2 className="mt-2 font-medium">{mealData.breakfast.dishName}</h2>
              </section>
            )}

            {mealData?.lunch?.dishName && (
              <section
                onClick={() => setOpenModal({ ...openModal, lunch: true })}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <label className="block text-sm font-medium text-gray-700">Lunch</label>
                {getMealImage('lunch')}
                <h2 className="mt-2 font-medium">{mealData.lunch.dishName}</h2>
              </section>
            )}

            {mealData?.dinner?.dishName && (
              <section
                onClick={() => setOpenModal({ ...openModal, dinner: true })}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <label className="block text-sm font-medium text-gray-700">Dinner</label>
                {getMealImage('dinner')}
                <h2 className="mt-2 font-medium">{mealData.dinner.dishName}</h2>
              </section>
            )}
          </div>

          {/* <FoodModal
            mealType="breakfast"
            mealData={mealData.breakfast}
            isOpen={openModal.breakfast}
            onClose={() => setOpenModal({ ...openModal, breakfast: false })}
            getMealImage={getMealImage}
          />

          <FoodModal
            mealType="lunch"
            mealData={mealData.lunch}
            isOpen={openModal.lunch}
            onClose={() => setOpenModal({ ...openModal, lunch: false })}
            getMealImage={getMealImage}
          />

          <FoodModal
            mealType="dinner"
            mealData={mealData.dinner}
            isOpen={openModal.dinner}
            onClose={() => setOpenModal({ ...openModal, dinner: false })}
            getMealImage={getMealImage}
          />
           */}

          {mealTypes.map(
            (mealType) =>
              mealData?.[mealType]?.dishName && (
                <FoodModal
                  key={mealType}
                  mealType={mealType}
                  mealData={mealData[mealType]}
                  isOpen={openModal[mealType]}
                  onClose={() => setOpenModal((prev) => ({ ...prev, [mealType]: false }))}
                  getMealImage={getMealImage}
                />
              ),
          )}

          <div className="mt-6">
            <RegenerateButton
              mealPlanId={plan.id}
              onDelete={handleRegenerate}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}

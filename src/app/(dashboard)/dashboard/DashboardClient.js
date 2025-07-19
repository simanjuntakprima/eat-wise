'use client';
import React from 'react';
import { useEffect, useState } from 'react';

import FoodModal from '@/app/(app)/_components/foodModal';
import { RegenerateButton } from '@/app/(app)/_components/RegenerateButton';
import { getMealPlanById } from '@/app/(meal-plan)/create/action';
import { getMealImage } from '@/app/utils/prepareMealJson';

import { getMealPlanDetail } from './action';

function renderMealSection(mealType, mealData, setOpenModal) {
  if (!mealData?.[mealType]?.dishName) {
    return null; // Skip rendering if no dish is selected
  }

  return (
    <section
      key={mealType}
      onClick={() => setOpenModal((prev) => ({ ...prev, [mealType]: true }))}
      className="cursor-pointer items-stretch transition-opacity hover:opacity-80"
    >
      <h1 className="text-lg font-semibold capitalize">{mealType}</h1>
      <figure>
        {getMealImage(mealType)}
        <figcaption className="mt-2 font-medium">{mealData?.[mealType]?.dishName || 'No dish selected'}</figcaption>
      </figure>
    </section>
  );
}

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
    <div>
      <h1 className="text-3xl">{plan.title}</h1>

      <h4 className="mb-3">
        Day {plan.dayIndex} of {plan.days}
      </h4>

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
        <div>
          <div className="flex items-stretch justify-between gap-4">
            {mealTypes.map((mealType) => renderMealSection(mealType, mealData, setOpenModal))}
          </div>

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
        </div>
      )}
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { getMealImage } from '@/app/utils/prepareMealJson';
import FoodModal from '@/app/(app)/_components/foodModal';
export default function DashboardClient({ mealData, plan }) {
  const [openModal, setOpenModal] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-4 text-red-700">We are cooking your Meal Plan, wait . . .</p>
      <h1 className="text-xl font-semibold">{plan.title}</h1>
      <p>
        Day {plan.dayIndex} of {plan.days}
      </p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {mealData?.breakfast?.dishName && (
          <section
            onClick={() => setOpenModal({ ...openModal, breakfast: true })}
            className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-[#DED2B3]"
          >
            <label className="mb-2 font-bold">Breakfast</label>
            <div className="mb-2 h-16 w-24">{getMealImage('breakfast')}</div>
            <h2 className="text-center">{mealData.breakfast.dishName}</h2>
          </section>
        )}

        {/* Fixed the condition for lunch and dinner */}
        {mealData?.lunch?.dishName && (
          <section
            onClick={() => setOpenModal({ ...openModal, lunch: true })}
            className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-[#DED2B3]"
          >
            <label className="mb-2 font-bold">Lunch</label>
            <div className="mb-2 h-16 w-24">{getMealImage('lunch')}</div>
            <h2 className="text-center">{mealData.lunch.dishName}</h2>
          </section>
        )}

        {mealData?.dinner?.dishName && (
          <section
            onClick={() => setOpenModal({ ...openModal, dinner: true })}
            className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-[#DED2B3]"
          >
            <label className="mb-2 font-bold">Dinner</label>
            <div className="mb-2 h-16 w-24">{getMealImage('dinner')}</div>
            <h2 className="text-center">{mealData.dinner.dishName}</h2>
          </section>
        )}
      </div>

      {/* Modals */}
      <FoodModal
        mealType="breakfast"
        mealData={mealData?.breakfast}
        isOpen={openModal.breakfast}
        onClose={() => setOpenModal({ ...openModal, breakfast: false })}
        getMealImage={getMealImage}
      />

      <FoodModal
        mealType="lunch"
        mealData={mealData?.lunch}
        isOpen={openModal.lunch}
        onClose={() => setOpenModal({ ...openModal, lunch: false })}
        getMealImage={getMealImage}
      />

      <FoodModal
        mealType="dinner"
        mealData={mealData?.dinner}
        isOpen={openModal.dinner}
        onClose={() => setOpenModal({ ...openModal, dinner: false })}
        getMealImage={getMealImage}
      />
    </div>
  );
}

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
    <div className="px-4 py-10">
      <p className="text-red-700">We are cooking your Meal Plan, wait . . .</p>
      <h1 className="text-xl font-semibold">{plan.title}</h1>
      <p>
        Day {plan.dayIndex} of {plan.days}
      </p>

      <div className="mt-8 flex justify-between">
        {mealData.breakfast?.dishName && (
          <section onClick={() => setOpenModal({ ...openModal, breakfast: true })}>
            <label>Breakfast</label>
            {getMealImage('breakfast')}
            <h2>{mealData.breakfast.dishName}</h2>
          </section>
        )}

        {/* Fixed the condition for lunch and dinner */}
        {mealData.lunch?.dishName && (
          <section onClick={() => setOpenModal({ ...openModal, lunch: true })}>
            <label>Lunch</label>
            {getMealImage('lunch')}
            <h2>{mealData.lunch.dishName}</h2>
          </section>
        )}

        {mealData.dinner?.dishName && (
          <section onClick={() => setOpenModal({ ...openModal, dinner: true })}>
            <label>Dinner</label>
            {getMealImage('dinner')}
            <h2>{mealData.dinner.dishName}</h2>
          </section>
        )}
      </div>

      {/* Modals */}
      <FoodModal
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
    </div>
  );
}

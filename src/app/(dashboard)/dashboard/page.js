import prisma from '@/utils/prisma';
import moment from 'moment';
import React from 'react';
import { getMealPlanUser } from './action';
import { getMealImage } from '@/app/(meal-plan)/create/function';

export default async function Dashboard() {
  const mealPlanUser = await getMealPlanUser();
  const mealData = mealPlanUser['0'];
  const plan = mealPlanUser.plan;

  console.log('MealData', mealData);

  return (
    <div className="px-4 py-10">
      <p className="text-red-700">We are cooking your Meal Plan, wait . . .</p>
      <p className="font-semibold text-gray-500"></p>

      <h1 className="text-xl font-semibold">{plan.title}</h1>
      <p>
        Day {plan.dayIndex} of {plan.days}
      </p>

      <div className="mt-8 flex justify-between">
        {mealData.breakfast?.dishName && (
          <section>
            <label>Breakfast</label>
            {getMealImage('breakfast')}
            <h2>{mealData.breakfast.dishName}</h2>
          </section>
        )}

        {mealData.breakfast?.dishName && (
          <section>
            <label>Lunch</label>
            {getMealImage('lunch')}
            <h2>{mealData.lunch.dishName}</h2>
          </section>
        )}

        {mealData.breakfast?.dishName && (
          <section>
            <label>Dinner</label>
            {getMealImage('dinner')}
            <h2>{mealData.dinner.dishName}</h2>
          </section>
        )}
      </div>

      {/* <div className="mt-10">
        <button
          onClick={handleShare}
          disabled={noData}
          className="rounded-lg bg-[#4E3636] px-5 py-2 text-base text-white shadow-md transition hover:bg-[#857e6b] disabled:opacity-50"
        >
          Share Meal Plan
        </button>
        {noData && <p className="mt-2 text-sm text-gray-500">No meal data available.</p>}
      </div> */}

      {/* {selectedMeal && <FoodModal isOpen={isOpen} currentFood={selectedMeal} closeModal={() => setIsOpen(false)} />} */}
    </div>
  );
}

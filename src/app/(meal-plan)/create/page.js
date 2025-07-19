'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import BudgetInput from './_components/budgetInput';
import { checkActiveMealPlan, createMealPlan } from './action';

export default function CreateMeal() {
  const [budget, setBudget] = useState(0);
  const [duration, setDuration] = useState('');
  const [meals, setMeals] = useState([]);
  const [type, setType] = useState('');
  const [load, setLoad] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(null); // Initialize as null instead of false
  const [, setShowActivePlanPopup] = useState(false);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true); // New loading state

  useEffect(() => {
    const valid = budget >= 1000 && duration !== '' && meals.length > 0 && type !== '';
    setIsFormValid(valid);
  }, [budget, duration, meals, type]);

  useEffect(() => {
    const verifyActivePlan = async () => {
      try {
        const activePlan = await checkActiveMealPlan();
        setHasActivePlan(!!activePlan);
        setShowActivePlanPopup(!!activePlan);
      } catch (error) {
        console.error('Error checking active plan:', error);
        setHasActivePlan(false);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    verifyActivePlan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const formData = new FormData(event.target);

    try {
      await createMealPlan(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  const mealOptions = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
  ];

  if (isCheckingPlan) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-end space-x-1">
          <span className="text-lg font-medium text-[#A4907C]">Loading</span>
          <span className="flex h-6 items-end space-x-1">
            <span className="animate-wave block h-1 w-1 bg-[#A4907C]" style={{ animationDelay: '0.1s' }} />
            <span className="animate-wave block h-2 w-1 bg-[#A4907C]" style={{ animationDelay: '0.2s' }} />
            <span className="animate-wave block h-3 w-1 bg-[#A4907C]" style={{ animationDelay: '0.3s' }} />
            <span className="animate-wave block h-2 w-1 bg-[#A4907C]" style={{ animationDelay: '0.4s' }} />
            <span className="animate-wave block h-1 w-1 bg-[#A4907C]" style={{ animationDelay: '0.5s' }} />
          </span>
        </div>
      </div>
    );
  }

  if (hasActivePlan) {
    return (
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="mx-4 max-w-md rounded-lg bg-white p-6">
          <h3 className="mb-3 text-lg font-bold">You Have an Active Meal Plan</h3>
          <p className="mb-4">Please complete your current meal plan before creating a new one.</p>
          <button
            onClick={() => redirect('/dashboard')}
            className="w-full rounded-md bg-[#A4907C] py-2 text-white hover:bg-[#8C7A6B]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#CFDCE3] p-6">
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-4">
        {/* Rest of your form code remains the same */}
        {/* Meal Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="budget">
            Meal Budget
          </label>
          <BudgetInput onBudgetChange={(val) => setBudget(val)} />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Meal Plan Duration</label>
          <div className="flex items-center space-x-6 pt-2">
            {['1', '3', '5', '7'].map((value) => {
              const number = parseInt(value, 10);
              const labelText = `${number} ${number === 1 ? 'Day' : 'Days'}`;

              return (
                <div key={value} className="flex items-center gap-2">
                  <input
                    id={`days-${value}`}
                    name="days"
                    type="radio"
                    value={value}
                    checked={duration === value}
                    onChange={(e) => setDuration(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-[#A4907C] focus:ring-[#8C7A6B]"
                  />
                  <label htmlFor={`days-${value}`} className="text-sm font-normal text-gray-700">
                    {labelText}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meals per Day */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Meals per Day</label>
          <div className="flex items-center space-x-6 pt-2">
            {mealOptions.map((meal) => (
              <div key={meal.id} className="flex items-center gap-2">
                <input
                  id={meal.id}
                  name="mealTimes"
                  type="checkbox"
                  value={meal.id}
                  checked={meals.includes(meal.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    setMeals((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#A4907C] focus:ring-[#8C7A6B]"
                />
                <label htmlFor={meal.id} className="text-sm font-normal text-gray-700">
                  {meal.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="allergies">
            Food Allergies
          </label>
          <Textarea
            id="allergies"
            name="allergies"
            placeholder="i.e: kacang, susu"
            className="bg-[#f1f0eb] placeholder:text-gray-500"
          />
        </div>

        {/* Food Preferences */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="type">
            Food Preferences
          </label>
          <Select onValueChange={(value) => setType(value)}>
            <SelectTrigger id="type" className="bg-[#F2EAD3]">
              <SelectValue placeholder="Preferences" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indonesia">Indonesia</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="Sunda">Sunda</SelectItem>
              <SelectItem value="Manado">Manado</SelectItem>
              <SelectItem value="Vietnam">Vietnam</SelectItem>
              <SelectItem value="Makassar">Makassar</SelectItem>
              <SelectItem value="Cina">Cina</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="type" value={type} />
        </div>

        {/* Submit Button */}
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            disabled={load || !isFormValid}
            className="mt-3 w-fit rounded-md bg-[#A4907C] px-4 py-[6px] text-sm text-white hover:bg-[#8C7A6B] disabled:bg-gray-400"
          >
            {load ? 'Loading...' : 'Generate Meal Plan Now'}
          </Button>
        </div>
      </form>
    </div>
  );
}

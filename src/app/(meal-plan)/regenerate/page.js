'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { regenerateMealPlanUser, getMealPlanById } from './action';
import BudgetInput from '../create/_components/budgetInput';
import { useSearchParams } from 'next/navigation';

export default function RegenerateMeal() {
  const searchParams = useSearchParams();
  const mealPlanId = searchParams.get('mealPlanId');

  const [aiResult, setAiResult] = useState('');
  const [budget, setBudget] = useState(0);
  const [duration, setDuration] = useState('');
  const [meals, setMeals] = useState([]);
  const [type, setType] = useState('');
  const [load, setLoad] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // New loading state
  const [allergies, setAllergies] = useState(''); // Added allergies state

  // Fetch existing meal plan data
  useEffect(() => {
    const fetchMealPlanData = async () => {
      if (!mealPlanId) return;

      try {
        setIsLoadingData(true);
        const existingMealPlan = await getMealPlanById(mealPlanId);

        if (existingMealPlan) {
          setBudget(existingMealPlan.budget || 0);
          setDuration(existingMealPlan.duration?.toString() || '');
          setMeals(existingMealPlan.meals || []);
          setType(existingMealPlan.type || '');
          setAllergies(existingMealPlan.allergies || '');
        }
      } catch (error) {
        console.error('Failed to fetch meal plan:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMealPlanData();
  }, [mealPlanId]);

  useEffect(() => {
    const valid = budget >= 1000 && duration !== '' && meals.length > 0 && type !== '';
    setIsFormValid(valid);
  }, [budget, duration, meals, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setAiResult('');

    const formData = new FormData();
    formData.append('budget', budget.toString());
    formData.append('days', duration);
    formData.append('type', type);
    formData.append('allergies', allergies);
    formData.append('existingMealPlanId', mealPlanId);
    meals.forEach((meal) => formData.append('mealTimes', meal));

    try {
      console.log('isi form', formData);
      const res = await regenerateMealPlanUser(formData);
      // Handle response as before
    } catch (error) {
      console.error(error);
      setAiResult('Error while sending to server');
    } finally {
      setLoad(false);
    }
  };

  const mealOptions = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
  ];

  if (isLoadingData) {
    return (
      <div className="rounded-xl bg-[#CFDCE3] p-6">
        <p>Loading meal plan data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#CFDCE3] p-6">
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-4">
        {/* Meal Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="budget">
            Meal Budget
          </label>
          <BudgetInput onBudgetChange={(val) => setBudget(val)} initialValue={budget} />
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
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="i.e: kacang, susu"
            className="bg-[#f1f0eb] placeholder:text-gray-500"
          />
        </div>

        {/* Food Preferences */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="type">
            Food Preferences
          </label>
          <Select value={type} onValueChange={(value) => setType(value)}>
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
            {load ? 'Loading...' : 'Regenerate Meal Plan'}
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import BudgetInput from '../create/_components/budgetInput';
import { getMealPlanData, regenerateMealPlanUser } from './action';

export default function RegenerateMeal() {
  const searchParams = useSearchParams();
  const mealPlanId = searchParams.get('mealPlanId');
  const [initialFormData, setInitialFormData] = useState(null);
  const [showUnchangedWarning, setShowUnchangedWarning] = useState(false);
  const [formData, setFormData] = useState({
    budget: 0,
    duration: '',
    meals: [],
    type: '',
    allergies: '',
  });

  const [load, setLoad] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const hasFormChanged = () => {
    if (!initialFormData) return true; // Allow submit if no initial data loaded

    return (
      formData.budget !== initialFormData.budget ||
      formData.duration !== initialFormData.duration ||
      !arraysEqual(formData.meals, initialFormData.meals) ||
      formData.type !== initialFormData.type ||
      formData.allergies !== initialFormData.allergies
    );
  };

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    return sortedA.every((val, index) => val === sortedB[index]);
  };

  // Fetch existing meal plan data
  useEffect(() => {
    const fetchMealPlanData = async () => {
      if (!mealPlanId) return;

      try {
        setIsLoadingData(true);
        const response = await getMealPlanData(mealPlanId);
        console.log('API Response:', response);

        if (response) {
          const initialData = {
            budget: response.budget || 0,
            duration: response.days?.toString() || '',
            meals: [
              ...(response.breakfast ? ['breakfast'] : []),
              ...(response.lunch ? ['lunch'] : []),
              ...(response.dinner ? ['dinner'] : []),
            ],
            type: response.cuisineCategories || '',
            allergies: response.allergies || '',
          };

          setFormData(initialData);
          setInitialFormData(initialData); // This was missing
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMealPlanData();
  }, [mealPlanId]);

  // Form validation
  useEffect(() => {
    const valid =
      formData.budget >= 1000 && formData.duration !== '' && formData.meals.length > 0 && formData.type !== '';
    setIsFormValid(valid);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasFormChanged()) {
      setShowUnchangedWarning(true);
      return;
    }
    setLoad(true);

    const submitData = new FormData();
    submitData.append('budget', formData.budget.toString());
    submitData.append('days', formData.duration);
    submitData.append('type', formData.type);
    submitData.append('allergies', formData.allergies);
    submitData.append('existingMealPlanId', mealPlanId);
    formData.meals.forEach((meal) => submitData.append('mealTimes', meal));

    try {
      console.log('Form data:', submitData);
      await regenerateMealPlanUser(submitData);
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
          <BudgetInput
            initialValue={formData.budget}
            onBudgetChange={(val) => setFormData((prev) => ({ ...prev, budget: val }))}
          />
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
                    checked={formData.duration === value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
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
                  checked={formData.meals.includes(meal.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      meals: checked ? [...prev.meals, meal.id] : prev.meals.filter((item) => item !== meal.id),
                    }));
                  }}
                />
                <label htmlFor={meal.id}>{meal.label}</label>
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
            value={formData.allergies}
            onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
            placeholder="i.e: kacang, susu"
            className="bg-[#f1f0eb] placeholder:text-gray-500"
          />
        </div>

        {/* Food Preferences */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="type">
            Food Preferences
          </label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
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
      {/* Move outside the form or at least outside the submit button div */}
      {showUnchangedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="mx-4 max-w-md rounded-lg border border-gray-100 bg-white/95 p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-bold">No Changes Made</h3>
            <p className="mb-4 text-gray-600">Please update at least one field before submitting.</p>
            <button
              onClick={() => setShowUnchangedWarning(false)}
              className="w-full rounded-md bg-[#A4907C] py-2 text-white hover:bg-[#8C7A6B]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

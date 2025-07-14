'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { createMealPlan } from './action';
// import { saveMealPlan } from './function';

export default function CreateMeal() {
  const [type, setType] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [load, setLoad] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoad(true);
    setAiResult('');
    const formData = new FormData(event.target);
    
    try {
      const res = await createMealPlan(formData);
      // if (res?.success) {
      //   saveMealPlan(res.headerData, res.result);
      //   setAiResult(res.result);
      // } else {
      //   setAiResult('Unsuccessful to create meal plan. Try again!');
      // }
    } catch (error) {
      console.error(error);
      setAiResult('Error while sending to server');
    } finally {
      setLoad(false);
    }
  }

  // Daftar pilihan untuk checkbox
  const mealOptions = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-4">
        {/* Meal Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="budget">
            Meal Budget
          </label>
          <Input
            id="budget"
            type="number"
            name="budget"
            placeholder="Rp 100000"
            className="bg-[#F2EAD3] placeholder:text-gray-500"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Meal Plan Duration</label>
          <div className="flex items-center space-x-6 pt-2">
            {['1', '3', '5', '7'].map((value) => (
              <div key={value} className="flex items-center gap-2">
                <input
                  id={`days-${value}`}
                  name="days"
                  type="radio"
                  value={value}
                  className="h-4 w-4 border-gray-300 text-[#A4907C] focus:ring-[#8C7A6B]"
                />
                <label htmlFor={`days-${value}`} className="text-sm font-normal text-gray-700">
                  {value} Hari
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* --- BLOK YANG DIUBAH --- */}
        {/* Meals per Day (Checkbox) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Meals per Day</label>
          <div className="flex items-center space-x-6 pt-2">
            {mealOptions.map((meal) => (
              <div key={meal.id} className="flex items-center gap-2">
                <input
                  id={meal.id}
                  name="mealTimes" // Nama yang sama untuk semua checkbox
                  type="checkbox"
                  value={meal.id} // Nilai yang akan dikirim: 'breakfast', 'lunch', 'dinner'
                  className="h-4 w-4 rounded border-gray-300 text-[#A4907C] focus:ring-[#8C7A6B]"
                />
                <label htmlFor={meal.id} className="text-sm font-normal text-gray-700">
                  {meal.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* --- AKHIR BLOK YANG DIUBAH --- */}

        {/* Allergies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="allergies">
            Food Allergies
          </label>
          <Textarea
            id="allergies"
            name="allergies"
            placeholder="Contoh: kacang, susu"
            className="bg-[#F2EAD3] placeholder:text-gray-500"
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
        <div>
          <Button
            type="submit"
            disabled={load}
            className="mt-4 w-full rounded-md bg-[#A4907C] px-4 py-2 text-white hover:bg-[#8C7A6B] disabled:bg-gray-400"
          >
            {load ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </form>

      {load && <p className="mt-4 text-center text-gray-700">Generating your meal plan . . .</p>}
      {aiResult && (
        <div className="mx-auto mt-6 max-w-3xl rounded bg-white p-4 text-sm whitespace-pre-wrap shadow">
          <h2 className="mb-2 text-lg font-semibold">Meal Plan Result:</h2>
          {aiResult}
        </div>
      )}
    </div>
  );
}

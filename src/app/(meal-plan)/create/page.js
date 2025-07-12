'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { createMealPlan } from './action';

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

      if (res?.success) {
        setAiResult(res.aiMealPlan);
      } else {
        setAiResult('Unsuccessful to create meal plan. Try again!')
      }
    } catch (error) {
      console.error(error);
      setAiResult('Erroe while sending to server');
    } finally {
      setLoad(false);
    }
  }

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
            placeholder="Rp 100000"
            className="bg-[#F2EAD3] placeholder:text-gray-500"
            name="budget"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Meal Plan Duration</label>
          <div className="flex items-center space-x-6 pt-2">
            {['3', '5', '7'].map((value) => (
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

        {/* Frequency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Daily Meal Frequency</label>
          <div className="flex items-center space-x-6 pt-2">
            {['2', '3'].map((value) => (
              <div key={value} className="flex items-center gap-2">
                <input
                  id={`frequency-${value}`}
                  name="frequency"
                  type="radio"
                  value={value}
                  className="h-4 w-4 border-gray-300 text-[#A4907C] focus:ring-[#8C7A6B]"
                />
                <label htmlFor={`makan-${value}`} className="text-sm font-normal text-gray-700">
                  {value}x
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
              <SelectItem value="a">a</SelectItem>
              <SelectItem value="b">b</SelectItem>
              <SelectItem value="c">c</SelectItem>
              <SelectItem value="d">d</SelectItem>
              <SelectItem value="e">e</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="type" value={type} />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="mt-4 w-full rounded-md bg-[#A4907C] px-4 py-2 text-white hover:bg-[#8C7A6B]">
            Submit
          </Button>
        </div>
      </form>

      {load && <p className="mt-4 text-center text-gray-700">Loading . . .</p>}
      {aiResult && (
        <div className="mx-auto mt-6 max-w-3xl rounded bg-white p-4 text-sm whitespace-pre-wrap shadow">
          <h2 className="mb-2 text-lg font-semibold">Meal Plan Result:</h2>
          {aiResult}
        </div>
      )}
    </div>
  );
}

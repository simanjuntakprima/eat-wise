'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { createMealPlan } from './action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateMeal() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <form className="mx-auto grid max-w-3xl ">
        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Budget </label>
          <Input
            type="number"
            placeholder="Rp 100000"
            className="bg-[#F2EAD3] placeholder:text-gray-500"
            name="budget"
          />
        </div>

        {/* Hari */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Berapa Hari </label>
          <Select name="days">
            <SelectTrigger className="bg-[#F2EAD3]">
              <SelectValue placeholder="Pilih berapa hari" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Hari</SelectItem>
              <SelectItem value="5">5 Hari</SelectItem>
              <SelectItem value="7">7 Hari</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kali Makan */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Berapa Kali Makan </label>
          <Select name="makan">
            <SelectTrigger className="bg-[#F2EAD3]">
              <SelectValue placeholder="Pilih berapa kali makan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alergi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Alergi</label>
          <Textarea
            name="alergi"
            placeholder="Contoh: kacang, susu"
            className="bg-[#F2EAD3] placeholder:text-gray-500"
          />
        </div>

        {/* Food Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">Food Type </label>
          <Select name="type">
            <SelectTrigger className="bg-[#F2EAD3]">
              <SelectValue placeholder="Pilih tipe makanan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">a</SelectItem>
              <SelectItem value="b">b</SelectItem>
              <SelectItem value="c">c</SelectItem>
              <SelectItem value="d">d</SelectItem>
              <SelectItem value="e">e</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="mt-4 w-full rounded-md bg-[#A4907C] px-4 py-2 text-white hover:bg-[#8C7A6B]"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

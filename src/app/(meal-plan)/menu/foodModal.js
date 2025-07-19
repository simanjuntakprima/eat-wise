'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
// -> Impor komponen Dialog dari shadcn/ui
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function FoodModal({ foods }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  if (!foods || foods.length === 0) {
    return <div>No food data available.</div>;
  }

  const currentFood = foods[activeIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid grid-cols-5 gap-4">
        {foods.map((food, i) => (
          <Button key={i} onClick={() => openModal(i)} className="h-20 w-50 bg-amber-100 text-black">
            {food.title}
          </Button>
        ))}
      </div>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{currentFood.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div>
              <p className="font-semibold">Bahan</p>
              <ul className="list-inside list-disc">
                {currentFood.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Cara Memasak</p>
              <ol className="list-inside list-decimal">
                {currentFood.steps.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* <DialogFooter className="flex w-full justify-between">
          <Button onClick={goPrev} disabled={activeIndex === 0} className="bg-[#4E3636] text-white">
            ←
          </Button>
          <Button onClick={goNext} disabled={activeIndex === foods.length - 1} className="bg-[#4E3636] text-white">
            →
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

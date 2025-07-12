'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/src/components/ui/button';

export default function FoodModal({ foods }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openModal = (index) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)

  const goNext = () => {
    if (activeIndex < foods.length - 1) setActiveIndex((i) => i + 1)
  }

  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex((i) => i - 1)
  }

  const currentFood = foods[activeIndex]

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {foods.map((food, i) => (
          <Button key={i} onClick={() => openModal(i)} className="h-20 w-full bg-amber-100 text-black">
            {food.title}
          </Button>
        ))}
      </div>

      {/* Global Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90%] max-w-xl rounded-xl bg-white p-6">
            <button className="absolute top-2 right-2 text-xl" onClick={closeModal}>
              ×
            </button>

            <h2 className="mb-4 text-xl font-bold">{currentFood.title}</h2>

            <div className="mb-4 flex justify-center">
              <Image src={currentFood.image} alt={currentFood.title} width={150} height={100} className="rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Informasi Gizi</p>
                <p>{currentFood.nutrition}</p>
              </div>
              <div>
                <p className="font-semibold">Bahan</p>
                <ul className="ml-5 list-decimal">
                  {currentFood.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Cara Memasak</p>
                <ol className="ml-5 list-decimal">
                  {currentFood.steps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button onClick={goPrev} disabled={activeIndex === 0} className="bg-[#4E3636] text-black">
                ←
              </Button>
              <Button onClick={goNext} disabled={activeIndex === foods.length - 1} className="bg-[#4E3636] text-black">
                →
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

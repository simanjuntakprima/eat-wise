'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

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
          <Button
            key={i}
            onClick={() => openModal(i)}
            className="bg-amber-100 text-black w-full h-20"
          >
            {food.title}
          </Button>
        ))}
      </div>

      {/* Global Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeModal}
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">{currentFood.title}</h2>

            <div className="flex justify-center mb-4">
              <Image
                src={currentFood.image}
                alt={currentFood.title}
                width={150}
                height={100}
                className="rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Informasi Gizi</p>
                <p>{currentFood.nutrition}</p>
              </div>
              <div>
                <p className="font-semibold">Bahan</p>
                <ul className="list-decimal ml-5">
                  {currentFood.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Cara Memasak</p>
                <ol className="list-decimal ml-5">
                  {currentFood.steps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="bg-[#4E3636] text-black"
              >
                ←
              </Button>
              <Button
                onClick={goNext}
                disabled={activeIndex === foods.length - 1}
                className="bg-[#4E3636] text-black"
              >
                →
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

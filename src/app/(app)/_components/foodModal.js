'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function FoodModal({ mealType, mealData, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{mealType}</DialogTitle>
          <DialogDescription>{mealData?.dishName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            {mealData?.ingredients && (
              <p className="text-sm">
                <span className="font-medium">Ingredients:</span> {mealData?.ingredients}
              </p>
            )}
            {mealData?.instructions && (
              <p className="text-sm">
                <span className="font-medium">Instructions:</span> {mealData?.instructions}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    // <Dialog open={isOpen} onOpenChange={setIsOpen}>
    //   <div className="grid grid-cols-5 gap-4">
    //     {foods.map((food, i) => (
    //       <Button key={i} onClick={() => openModal(i)} className="h-20 w-full bg-amber-100 text-black">
    //         {food.title}
    //       </Button>
    //     ))}
    //   </div>
    //   <DialogContent className="sm:max-w-xl">
    //     <DialogHeader>
    //       <DialogTitle className="text-xl">{currentFood.title}</DialogTitle>
    //     </DialogHeader>

    //     <div className="space-y-4">
    //       <div className="flex justify-center">
    //         <Image src={currentFood.image} alt={currentFood.title} width={150} height={100} className="rounded" />
    //       </div>

    //       <div className="grid grid-cols-2 gap-4 text-sm">
    //         <div>
    //           <p className="font-semibold">Informasi Gizi</p>
    //           <p>{currentFood.nutrition}</p>
    //         </div>
    //         <div>
    //           <p className="font-semibold">Bahan</p>
    //           <ul className="list-inside list-disc">
    //             {currentFood.ingredients.map((item, i) => (
    //               <li key={i}>{item}</li>
    //             ))}
    //           </ul>
    //         </div>
    //         <div className="col-span-2">
    //           <p className="font-semibold">Cara Memasak</p>
    //           <ol className="list-inside list-decimal">
    //             {currentFood.steps.map((item, i) => (
    //               <li key={i}>{item}</li>
    //             ))}
    //           </ol>
    //         </div>
    //       </div>
    //     </div>

    //     <DialogFooter className="flex w-full justify-between">
    //       <Button onClick={goPrev} disabled={activeIndex === 0} className="bg-[#4E3636] text-white">
    //         ←
    //       </Button>
    //       <Button onClick={goNext} disabled={activeIndex === foods.length - 1} className="bg-[#4E3636] text-white">
    //         →
    //       </Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
}

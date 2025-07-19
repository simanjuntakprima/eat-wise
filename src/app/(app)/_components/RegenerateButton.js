'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function RegenerateButton({ mealPlanId }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  console.log('want to regenerate ', mealPlanId);
  const handleRegenerate = () => {
    router.push(`/regenerate?mealPlanId=${mealPlanId}`);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Regenerate Meal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will delete your current meal plan and generate a new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenerate}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

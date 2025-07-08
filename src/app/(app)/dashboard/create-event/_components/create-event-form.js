'use client';

import React, { useActionState } from 'react';

import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { createEventAction } from '../action';

export function CreateEventForm({ categories }) {
  const [state, action, pending] = useActionState(createEventAction, null);

  return (
    <form action={action} className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="event-name">Name</Label>
        <Input name="name" id="event-name" placeholder="Event Name" />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select name="categoryId">
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-description">Description</Label>
        <Input name="description" id="event-description" placeholder="Event Description" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-date">Date</Label>
        <Input name="date" id="event-date" placeholder="Event Date" type="datetime-local" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-location">Location</Label>
        <Input name="location" id="event-location" placeholder="Event Location" />
      </div>
      <Button className="col-span-2" type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Event'}
      </Button>
      <AlertState state={state} />
    </form>
  );
}

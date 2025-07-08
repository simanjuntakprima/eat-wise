import React from 'react';

import { getCategoryBySlug } from '@/services/categories';
import { getEventsByCategory } from '@/services/event';

import { EventCard } from '../_components/event-card';

export default async function Page({ params }) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const events = await getEventsByCategory(categorySlug);

  return (
    <main className="space-y-24">
      <section className="space-y-4 text-center text-balance">
        <h1 className="text-6xl">{category.name}</h1>
      </section>
      <section>
        <div className="grid grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}

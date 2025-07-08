import Link from 'next/link';

import { getAllCategories } from '@/services/categories';
import { getAllEvents } from '@/services/event';

import { EventCard } from './_components/event-card';

export default async function Page() {
  const events = await getAllEvents();
  const categories = await getAllCategories();

  return (
    <div className="pt-12">
      <main className="space-y-18">
        <section className="space-y-4 text-center text-balance">
          <h1 className="text-6xl">Eventmakers</h1>
          <div className="m-auto max-w-xl text-lg text-balance">
            Eventmakers is a platform for creating and sharing events. It is a platform for creating and sharing events.
          </div>
        </section>
        <section className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="cursor-pointer rounded-lg border border-zinc-100 bg-white p-6 text-sm font-medium transition-all duration-150 hover:bg-indigo-500 hover:text-white"
            >
              <div>{category.name}</div>
            </Link>
          ))}
        </section>
        <section className="space-y-4">
          <h1>Events</h1>
          <div className="grid grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

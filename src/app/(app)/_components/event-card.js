import { Pin } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

export const EventCard = ({ event }) => {
  return (
    <Link
      href={`/events/${event.slug}`}
      key={event.id}
      className="group grid h-fit cursor-pointer grid-cols-3 items-start gap-8 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50"
    >
      {event.logoUrl ? (
        <img src={event.logoUrl} alt={event.name} className="h-32 w-full rounded-md object-cover" />
      ) : (
        <div className="h-32 w-full rounded-md border bg-indigo-500" />
      )}
      <section className="col-span-2 flex h-full flex-col justify-center gap-4">
        <section className="space-y-1">
          <div className="text-xl font-bold">{event.name}</div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <div>{moment(event.date).format('DD/MM/YYYY')}</div>
            <div>{moment(event.date).format('HH:mm')} WIB</div>
          </div>
        </section>
        <div className="flex w-fit items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 transition-all duration-150 group-hover:bg-indigo-500 group-hover:text-white">
          <Pin size={16} />
          <div className="text-sm font-medium">{event.location}</div>
        </div>
      </section>
    </Link>
  );
};

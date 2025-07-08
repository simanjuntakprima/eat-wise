import { PinIcon, Timer } from 'lucide-react';
import moment from 'moment';

import { getEventBySlug } from '@/services/event';

export default async function Page({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return (
    <main className="space-y-24 rounded-xl border bg-white p-2 pb-12">
      <section className="relative">
        {event.imageCoverUrl ? (
          <img src={event.imageCoverUrl} alt={event.name} className="h-64 w-full rounded-md object-cover shadow-lg" />
        ) : (
          <div className="h-64 w-full rounded-md border bg-indigo-500" />
        )}
        {event.logoUrl ? (
          <img
            src={event.logoUrl}
            alt={event.name}
            className="absolute -bottom-10 left-10 h-24 w-24 rounded-md border-2 border-white object-cover shadow-lg"
          />
        ) : (
          <div className="absolute -bottom-10 left-10 h-24 w-24 rounded-md border-2 border-white bg-indigo-500 shadow-lg" />
        )}
      </section>
      <div className="m-auto max-w-3xl space-y-12">
        <section className="space-y-2">
          <div className="text-3xl font-bold">{event.name}</div>
          <div className="flex items-center gap-1 font-medium tracking-tight">
            <Timer size={16} />
            <div>{moment(event.date).format('MMMM Do, YYYY')}</div>
            <div>-</div>
            <div>{moment(event.date).format('HH:mm')} WIB</div>
          </div>
          <div className="flex items-center gap-1 font-medium tracking-tight">
            <PinIcon size={16} />
            <div>{event.location}</div>
          </div>
        </section>
        <section className="space-y-2">
          <div className="text-2xl font-bold">Description</div>
          <div className="font-medium whitespace-pre-wrap">{event.description}</div>
        </section>
      </div>
    </main>
  );
}

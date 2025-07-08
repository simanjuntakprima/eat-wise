import { Pin } from 'lucide-react';
import moment from 'moment';

import { getCurrentSession } from '@/services/auth';
import { getEvents } from '@/services/event';

export default async function Page() {
  const session = await getCurrentSession();
  const events = await getEvents(session.user.id);

  return (
    <div>
      <main className="space-y-8">
        <h1>Events</h1>
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="grid min-h-48 cursor-pointer grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50"
            >
              <div className="h-full w-full rounded-md bg-indigo-100" />
              <section className="space-y-3">
                <section>
                  <div className="text-2xl font-bold">{event.name}</div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <div>{moment(event.date).format('DD/MM/YYYY')}</div>
                    <div>{moment(event.date).format('HH:mm')} WIB</div>
                  </div>
                </section>
                <div className="flex items-center gap-2">
                  <Pin size={16} />
                  <div>{event.location}</div>
                </div>
                <div>{event.description}</div>
              </section>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import { getAllCategories } from '@/services/categories';

import { CreateEventForm } from './_components/create-event-form';

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <div className="m-auto max-w-2xl">
      <main className="space-y-4">
        <h1>Create Event</h1>
        <CreateEventForm categories={categories} />
      </main>
    </div>
  );
}

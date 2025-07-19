import { redirect } from 'next/navigation';

import { getCurrentSession } from '@/services/auth';

export default async function Home() {
  const userSession = await getCurrentSession();

  if (userSession) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

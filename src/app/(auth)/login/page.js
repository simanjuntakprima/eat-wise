'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { loginAction } from '../action';

export default function Page() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1>Login</h1>
        <p>Login to your account</p>
      </section>
      <form className="flex flex-col gap-2" action={action}>
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button type="submit" disabled={pending}>
          {pending ? 'Logging in...' : 'Login'}
        </Button>
        <AlertState success={state?.success} error={state?.error} />
      </form>
      <section>
        <p>
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </section>
    </div>
  );
}

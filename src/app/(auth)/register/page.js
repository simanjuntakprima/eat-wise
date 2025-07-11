'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SocialLogin } from '../_components/social-login';
import { registerAction } from '../action';

export default function Page() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen">
      <div
        className="hidden w-1/2 bg-cover bg-center md:block"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-black/50 p-2 text-white">
          <div className="ml-40 bg-[#B5A668]/70 p-5 rounded-lg">
            <h2 className="mb-4 text-3xl font-bold">Sign up to start meal-planning</h2>
            <p className="mt-2 text-[#8D2611] text-xl font-bold">Grab a ready-made meal guide.</p>
          </div>
        </div>
      </div>


      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-center text-3xl font-bold">Sign Up</h2>
            <form action={registerAction} className="space-y-4">
              <Input name="name" type="text" placeholder="Full name" className="w-full rounded-lg border p-3" />
              <Input name="email" type="email" placeholder="Email address" className="w-full rounded-lg border p-3" />
              <Input name="password" type="password" placeholder="Password" className="w-full rounded-lg border p-3" />
              <Button type="submit" className="w-full rounded-lg bg-black p-3 text-white">
                Join us →
              </Button>
              <div className="text-center text-sm text-gray-500">or</div>
              <AlertState success={state?.success} error={state?.error} />
            </form>
          <SocialLogin />
          <div className="mt-6 text-center text-sm text-gray-600">
            Do you have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
'use client';

import Link from 'next/link';
import { useActionState } from 'react';
// import { FcGoogle } from 'react-icons/fc';

import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { loginAction } from '../action';
import { SocialLogin } from '../_components/social-login';

export default function Page() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}

      <div
        className="hidden w-1/2 bg-cover bg-center md:block"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-black/50 p-10 text-white">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Sign up to start meal-planning</h2>
            <p className="mt-2">Grab a ready-made meal guide.</p>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full bg-white p-8 md:w-1/2 md:p-14">
        <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-gray-600">Sign in to your account</p>

        <form className="flex flex-col gap-4" action={action}>
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
          </Button>
          <AlertState success={state?.success} error={state?.error} />
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Login Button */}
        <SocialLogin />

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
=======
'use client';

import Link from 'next/link';
import { useActionState } from 'react';

// import { FcGoogle } from 'react-icons/fc';
import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SocialLogin } from '../_components/social-login';
import { loginAction } from '../action';

export default function Page() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}

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

      {/* Right Panel (Form) */}
      <div className="w-full bg-white p-8 md:w-1/2 md:p-14">
        <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-gray-600">Sign in to your account</p>

        <form className="flex flex-col gap-4" action={action}>
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
          </Button>
          <AlertState success={state?.success} error={state?.error} />
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Login Button */}
        <SocialLogin />

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> eb7e9a1 (update create-meal into checkbox)

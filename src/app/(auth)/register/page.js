'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { AlertState } from '@/app/_components/alert-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <div className="flex h-full w-full items-center justify-center bg-black/50 p-10 text-white">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Sign up to start meal-planning</h2>
            <p className="mt-2">Grab a ready-made meal guide.</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-center text-3xl font-bold">Sign Up</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="First name" className="w-full rounded-lg border p-3" />
            <Input type="email" placeholder="Email address" className="w-full rounded-lg border p-3" />
            <Input type="password" placeholder="Password" className="w-full rounded-lg border p-3" />
            <div className="flex items-start">
              <Input type="checkbox" className="mr-2 h-4 w-4" />
              <span className="text-sm">Accept Terms & Conditions</span>
            </div>
            <Button type="submit" className="w-full rounded-lg bg-black p-3 text-white">
              Join us →
            </Button>
            <div className="text-center text-sm text-gray-500">or</div>
            <Button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border p-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
              Sign up with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

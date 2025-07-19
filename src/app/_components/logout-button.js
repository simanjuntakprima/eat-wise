'use client';

import { LogOut } from 'lucide-react';

import { logoutAction } from '@/app/(auth)/action';

export default function LogoutButton() {
  return (
    <form className="w-full" action={logoutAction}>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-[#F2EAD3] px-4 py-2 text-black transition-colors duration-200 hover:bg-[#8a8578] active:bg-[#F2EAD3]"
      >
        Logout&nbsp;
        <LogOut className="h-5 w-5" />
      </button>
    </form>
  );
}

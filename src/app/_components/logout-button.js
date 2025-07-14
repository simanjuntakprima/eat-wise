'use client';

import { logoutAction } from '@/app/(auth)/action';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="flex w-full items-center justify-between rounded bg-[#F2EAD3] px-4 py-2 text-black transition-colors duration-200 hover:bg-[#8a8578] active:bg-[#F2EAD3]">
        Logout
        <LogOut className="w-5 h-5" />
      </button>
    </form>
  );
}

import { ArrowLeft, Sparkle } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-transparent to-indigo-400">
      <div className="absolute top-0 left-0 flex w-full items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Sparkle size={16} />
          <div>eventmakers</div>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>
      <main className="w-[380px]">
        <div className="space-y-6 rounded-3xl bg-white p-12 shadow-xl shadow-indigo-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Sparkle size={15} className="text-indigo-500" />
          </div>
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}

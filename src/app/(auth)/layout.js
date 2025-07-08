import { ArrowLeft, Sparkle } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="max-h-screen">
      <div>{children}</div>
    </div>
  );
}

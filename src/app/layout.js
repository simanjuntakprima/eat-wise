
import './globals.css';
import { Button } from '@/components/ui/button';

export const metadata = {
  Title: 'EatWise',
  Description: 'diisi apa ini',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <aside className="flex w-64 flex-col gap-4 bg-[#4E2B2B] p-4 text-white">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-300" />
            <p className="mt-2 text-sm">Nagata Kaizure</p>
          </div>

          <Button className="rounded bg-[#EADDC5] px-4 py-2 text-black">Create Meal Plan!</Button>

          <div className="flex flex-col gap-2">
            <Button className="rounded bg-[#EADDC5] px-4 py-2 text-black">Menu</Button>
            <Button className="rounded bg-[#EADDC5] px-4 py-2 text-black">History</Button>
            <Button className="rounded bg-[#EADDC5] px-4 py-2 text-black">User Account</Button>
          </div>

          <div className="mt-auto">
            <Button className="flex w-full items-center justify-between rounded bg-[#EADDC5] px-4 py-2 text-black">
              Logout
              <span>↪️</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 bg-white p-8">{children}</main>
      </body>
    </html>
  );
}

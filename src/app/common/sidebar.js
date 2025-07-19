import Link from 'next/link';

import LogoutButton from '@/app/_components/logout-button';
import ProfilePage from '@/app/utils/profile';

const menuLinks = [
  { href: '/create', label: 'Generate meal plan' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/history', label: 'History' },
];

export default function Sidebar(props = []) {
  const { additionalLinks = {} } = props;
  const links = menuLinks.concat(additionalLinks.links || []);

  return (
    <aside className="flex w-64 flex-col items-center gap-4 rounded-lg bg-gradient-to-b from-[#FAF8F4]/90 to-[#C7B590]/90 p-4 text-[#1C1C1C] shadow-xl backdrop-blur-sm">
      <div>
        <ProfilePage></ProfilePage>
      </div>

      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="my-5">
              <Link
                href={link.href}
                className="flex justify-center self-stretch rounded-md bg-[#DED2B3] px-5 py-2 text-sm font-semibold text-[#1C1C1C] shadow-md transition duration-300 hover:bg-[#bda16d]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex self-stretch">
        <LogoutButton></LogoutButton>
      </div>
    </aside>
  );
}

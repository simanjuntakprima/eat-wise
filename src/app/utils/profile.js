import { getCurrentSession } from '@/services/auth';
import prisma from '@/utils/prisma';

import ProfileComponent from '../(app)/_components/profile-component';
export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
      },
    });

    return <ProfileComponent user={user} />;
  }
}

// export function getInitials(name) {
//   return name
//     ?.split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase();
// }

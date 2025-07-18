'use client';
import * as Avatar from '@radix-ui/react-avatar';

export default function ProfileComponent({ user }) {
  return (
    <div className="cardContent flex flex-col items-center">
      <Avatar.Root className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-300">
        <Avatar.Image className="h-full w-full object-cover" alt={user.name} />
        <Avatar.Fallback delayMs={500} className="text-xl font-semibold text-black">
          {user.name}
        </Avatar.Fallback>
      </Avatar.Root>
      <p className="mt-2 text-center text-sm text-black">Hi,{user.name}</p>
    </div>
  );
}

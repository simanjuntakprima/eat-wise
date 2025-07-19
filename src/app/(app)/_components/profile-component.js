'use client';
import Avatar from 'boring-avatars';

export default function ProfileComponent({ user }) {
  return (
    <div className="cardContent flex flex-col items-center">
      <Avatar
        size={120}
        name={user.name}
        colors={['#010d23', '#03223f', '#038bbb', '#fccb6f', '#e19f41']}
        variant="beam"
        square={false}
      />

      <p className="mt-2 text-center text-sm text-black">Hi, {user.name}</p>
    </div>
  );
}

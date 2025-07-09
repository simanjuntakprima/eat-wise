import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSession } from '@/services/auth';
import { getUserByEmail } from '@/services/user';
import { google } from '@/utils/arctic';
import prisma from '@/utils/prisma';

// export async function GET(request) {
//   console.log('Google callback route called');
//   const cookieStore = await cookies();
//   const url = new URL(request.url); // /callback/google/?code=.....
//   const code = url.searchParams.get('code');
//   const codeVerifier = cookieStore.get('codeVerfier')?.value;
//   const tokens = await google.validateAuthorizationCode(code, codeVerifier);
//   const accessToken = tokens.accessToken();

//   const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   const userInfo = await res.json();

//   return Response.json({ message: 'OK', userInfo });
// }

export async function GET(request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const codeVerifier = cookieStore.get('codeVerfier')?.value;

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await res.json();

    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      const newSession = await createSession(existingUser.id);
      cookieStore.set('session', newSession.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
        },
      });

      const newSession = await createSession(newUser.id);
      cookieStore.set('session', newSession.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      const code = e.code;
      console.log({ code });
    }
    if (e instanceof arctic.ArcticFetchError) {
      const cause = e.cause;
      console.log({ cause });
    }
    console.log({ e });
    return new Response('Invalid authorization code, credentials, or redirect URI', { status: 400 });
  }

  redirect('/');
}

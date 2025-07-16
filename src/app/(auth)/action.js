'use server';

import * as arctic from 'arctic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSession, verifyPassword } from '@/services/auth';
import { createUser, getUserByEmail } from '@/services/user';
import { google } from '@/utils/arctic';
import prisma from '@/utils/prisma';

export async function loginAction(_, formData) {
  const cookieStore = await cookies();

  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'All fields are required' };
  }

  const getWithPassword = true;
  const user = await getUserByEmail(email, getWithPassword);
  if (!user) {
    return { error: 'User not found' };
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return { error: 'Invalid password' };
  }

  const session = await createSession(user.id);
  cookieStore.set('session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 5,
    path: '/',
  });
  redirect('/dashboard');
}

export async function registerAction(_, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const cookieStore = await cookies();

  if (!name || !email || !password) {
    console.log('All fields are required');
    return { error: 'All fields are required' };
  }

  const user = await getUserByEmail(email);

  if (user) {
    console.log('ini user', user);
    return { error: 'User already exists' };
  }

  const newUser = await createUser(name, email, password);
  const session = await createSession(newUser.id);
  cookieStore.set('session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 5,
    path: '/',
  });
  return { success: 'User created successfully', user: newUser };
}

export async function googleLoginAction() {
  const cookieStore = await cookies();
  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();
  const scopes = ['openid', 'profile', 'email'];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);
  cookieStore.set('codeVerfier', codeVerifier);
  redirect(url);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session?.value) {
    try {
      await prisma.session.update({
        where: { id: session.value },
        data: {
          expiresAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error expiring session in DB:', error);
    }
  }

  cookieStore.set({
    name: 'session',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });

  redirect('/login');
}

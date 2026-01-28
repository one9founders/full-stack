'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign up failed');
  }

  const data: AuthResponse = await response.json();
  
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

  return data.user;
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

  return data.user;
}

export async function googleAuth(credential: string) {
  const response = await fetch(`${API_URL}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Google authentication failed');
  }

  const data: AuthResponse = await response.json();
  
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

  return data.user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

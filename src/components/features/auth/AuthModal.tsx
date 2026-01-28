'use client';

import { useState, useTransition, useEffect } from 'react';
import { signUp, login, googleAuth } from '@/lib/actions/auth';
import Swal from 'sweetalert2';
import posthog from 'posthog-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

declare global {
  interface Window {
    google: any;
  }
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'filled_black', size: 'large', width: '100%', text: 'continue_with' }
      );
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isOpen]);

  const handleGoogleResponse = (response: any) => {
    startTransition(async () => {
      try {
        const user = await googleAuth(response.credential);

        // Identify user in PostHog
        posthog.identify(user.email, {
          email: user.email,
          name: user.name,
        });

        // Capture Google auth event
        posthog.capture('user_logged_in_google', {
          email: user.email,
          name: user.name,
        });

        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) {
        posthog.captureException(error);
        Swal.fire('Error', error.message, 'error');
      }
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const email = formData.get('email') as string;
        const user = mode === 'signup' ? await signUp(formData) : await login(formData);

        // Identify user in PostHog
        posthog.identify(user.email || email, {
          email: user.email || email,
          name: user.name,
        });

        // Capture appropriate event based on mode
        if (mode === 'signup') {
          posthog.capture('user_signed_up', {
            email: user.email || email,
            name: user.name,
            method: 'email',
          });
        } else {
          posthog.capture('user_logged_in', {
            email: user.email || email,
            name: user.name,
            method: 'email',
          });
        }

        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) {
        posthog.captureException(error);
        Swal.fire('Error', error.message, 'error');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-lg p-8 max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)]"
          >
            {isPending ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--gray-700)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-[var(--gray-900)]">Or continue with</span>
            </div>
          </div>

          <div id="google-signin-button" className="mt-4"></div>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--gray-500)]">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="hover:underline text-[var(--brand-primary)]"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

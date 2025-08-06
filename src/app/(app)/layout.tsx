
'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GlitchLoader } from '@/components/ui/glitch-loader';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <GlitchLoader text="Authenticating..." />
        </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

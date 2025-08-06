import { AppSidebar } from '@/components/app/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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

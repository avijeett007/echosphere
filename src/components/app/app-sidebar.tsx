
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Pencil, History, LogOut, Library, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      isActive && "bg-muted text-primary"
    )}
  >
    {children}
  </Link>
);


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Logout Failed',
            description: 'There was an error logging you out. Please try again.',
        });
    }
  };


  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline">EchoSphere</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavLink href="/create-post" isActive={pathname === '/create-post'}>
              <Pencil className="h-4 w-4" />
              Create Post
            </NavLink>
            <NavLink href="/history" isActive={pathname === '/history'}>
              <History className="h-4 w-4" />
              Post History
            </NavLink>
            {isAdmin && (
              <NavLink href="/brand-templates" isActive={pathname === '/brand-templates'}>
                <Library className="h-4 w-4" />
                Brand Templates
              </NavLink>
            )}
            {isAdmin && (
               <NavLink href="/user-management" isActive={pathname === '/user-management'}>
                <Users className="h-4 w-4" />
                User Management
              </NavLink>
            )}
            <NavLink href="/settings" isActive={pathname === '/settings'}>
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4">
           <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

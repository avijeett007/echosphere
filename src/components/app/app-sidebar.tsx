'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Pencil, History, LogOut, Library, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const adminEmail = 'avijeett007@gmail.com';

// A placeholder for a real auth hook
const useUser = () => {
    // In a real app, you'd get this from your auth context
    return { user: { email: 'avijeett007@gmail.com' }, isLoading: false };
}


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    router.push('/login');
  };

  const isAdmin = user?.email === adminEmail;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-semibold text-sidebar-foreground">EchoSphere</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/create-post'} tooltip="Create Post">
              <Link href="/create-post">
                <Pencil />
                <span>Create Post</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/history'} tooltip="Post History">
              <Link href="/history">
                <History />
                <span>Post History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/brand-templates'} tooltip="Brand Templates">
              <Link href="/brand-templates">
                <Library />
                <span>Brand Templates</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/user-management'} tooltip="User Management">
                <Link href="/user-management">
                  <Users />
                  <span>User Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

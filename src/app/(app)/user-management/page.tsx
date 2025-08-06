import { InviteUserForm } from '@/components/app/invite-user-form';
import { UserList } from '@/components/app/user-list';

export default function UserManagementPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-2">User Management</h1>
      <p className="text-muted-foreground mb-8">
        Invite new users and manage existing ones.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="font-headline text-xl font-semibold mb-4">Invite New User</h2>
          <InviteUserForm />
        </div>
        <div className="lg:col-span-2">
           <h2 className="font-headline text-xl font-semibold mb-4">Existing Users</h2>
           <UserList />
        </div>
      </div>
    </div>
  );
}

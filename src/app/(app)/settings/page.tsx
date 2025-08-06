import { ChangePasswordForm } from "@/components/app/change-password-form";
import { UserProfileForm } from "@/components/app/user-profile-form";

export default function SettingsPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-headline text-3xl font-bold mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-headline text-xl font-semibold mb-4">Your Profile</h2>
                    <UserProfileForm />
                </div>
                 <div>
                    <h2 className="font-headline text-xl font-semibold mb-4">Change Password</h2>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}

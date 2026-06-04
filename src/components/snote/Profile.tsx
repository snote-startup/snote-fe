'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { User, Lock, Bell, Save } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';
import { toast } from 'sonner';

export function Profile() {
    const { user, setUser } = useApp();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [meetingReminders, setMeetingReminders] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [taskNotifications, setTaskNotifications] = useState(true);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            setUser({ ...user, name, email });
            toast.success('Profile updated successfully');
        }
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSaveNotifications = () => {
        toast.success('Notification preferences saved');
    };

    if (!user) return null;

    return (
        <div className="mx-auto max-w-4xl p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                    Profile Settings
                </h1>
                <p className="text-gray-600">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Header */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                        <span className="text-3xl font-semibold text-white">
                            {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </span>
                    </div>
                    <div>
                        <h2 className="mb-1 text-2xl font-semibold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
                                {user.subscription.plan} Plan
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">
                        <User className="mr-2 h-4 w-4" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="mr-2 h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Account Information
                        </h2>

                        <form
                            onSubmit={handleSaveProfile}
                            className="space-y-5"
                        >
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Danger Zone
                            </h3>
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                <p className="mb-3 text-sm text-red-700">
                                    Once you delete your account, there is no
                                    going back. This will permanently delete all
                                    your meetings, tasks, and data.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Change Password
                        </h2>

                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-5"
                        >
                            <div>
                                <Label htmlFor="current-password">
                                    Current Password
                                </Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="new-password">
                                    New Password
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="mt-2"
                                />
                                <p className="mt-1.5 text-sm text-gray-500">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirm-password">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Update Password
                                </Button>
                            </div>
                        </form>

                        {/* Two-Factor Authentication */}
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Two-Factor Authentication
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Add an extra layer of security to your account
                            </p>
                            <Button variant="outline">Enable 2FA</Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Notification Preferences
                        </h2>

                        <div className="space-y-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Email Notifications
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Receive email updates about your account
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setEmailNotifications(
                                            !emailNotifications,
                                        )
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        emailNotifications
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            emailNotifications
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Meeting Reminders */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Meeting Reminders
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Get reminders for upcoming calendar
                                        events
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setMeetingReminders(!meetingReminders)
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        meetingReminders
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            meetingReminders
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Task Notifications */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Task Notifications
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Notifications about task assignments and
                                        updates
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setTaskNotifications(!taskNotifications)
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        taskNotifications
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            taskNotifications
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Weekly Digest */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Weekly Digest
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Receive a weekly summary of your
                                        meetings and tasks
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setWeeklyDigest(!weeklyDigest)
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        weeklyDigest
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            weeklyDigest
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="pt-6">
                                <Button onClick={handleSaveNotifications}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Preferences
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                // Add logic to delete the account
                                toast.success('Account deleted successfully');
                                setShowDeleteDialog(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    Profile Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Header */}
            <div className="border-border bg-card mb-6 rounded-xl border p-6">
                <div className="flex items-center gap-6">
                    <div className="from-primary to-primary/80 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-primary-foreground text-3xl font-semibold">
                            {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-foreground mb-1 text-2xl font-semibold">
                            {user.name}
                        </h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="mt-2">
                            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize">
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
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
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
                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                Danger Zone
                            </h3>
                            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                                <p className="text-destructive mb-3 text-sm">
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
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
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
                                <p className="text-muted-foreground mt-1.5 text-sm">
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
                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Add an extra layer of security to your account
                            </p>
                            <Button variant="outline">Enable 2FA</Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            Notification Preferences
                        </h2>

                        <div className="space-y-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground font-medium">
                                        Email Notifications
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Receive email updates about your account
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            {/* Meeting Reminders */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground font-medium">
                                        Meeting Reminders
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Get reminders for upcoming calendar
                                        events
                                    </p>
                                </div>
                                <Switch
                                    checked={meetingReminders}
                                    onCheckedChange={setMeetingReminders}
                                />
                            </div>

                            {/* Task Notifications */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground font-medium">
                                        Task Notifications
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Notifications about task assignments and
                                        updates
                                    </p>
                                </div>
                                <Switch
                                    checked={taskNotifications}
                                    onCheckedChange={setTaskNotifications}
                                />
                            </div>

                            {/* Weekly Digest */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground font-medium">
                                        Weekly Digest
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Receive a weekly summary of your
                                        meetings and tasks
                                    </p>
                                </div>
                                <Switch
                                    checked={weeklyDigest}
                                    onCheckedChange={setWeeklyDigest}
                                />
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

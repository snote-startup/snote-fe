'use client';

import { Bell, Info, Lock, Save, ShieldAlert, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/providers/snote-app-provider';
import { useI18n } from '@/features/i18n/use-i18n';

function DisabledNotice() {
    const { t } = useI18n();
    return (
        <div className="border-border bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-lg border p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t('common.comingSoon')}</span>
        </div>
    );
}

export function Profile() {
    const { user } = useApp();
    const { t } = useI18n();

    if (!user) return null;

    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="mx-auto max-w-4xl p-8">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    {t('profile.title')}
                </h1>
                <p className="text-muted-foreground">{t('profile.subtitle')}</p>
            </div>

            <div className="border-border bg-card mb-6 rounded-xl border p-6">
                <div className="flex items-center gap-6">
                    <div className="from-primary to-primary/80 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-primary-foreground text-3xl font-semibold">
                            {initials}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-foreground mb-1 text-2xl font-semibold">
                            {user.name}
                        </h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="mt-2">
                            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                                {t('profile.accountActive')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">
                        <User className="mr-2 h-4 w-4" />
                        {t('profile.tab.account')}
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="mr-2 h-4 w-4" />
                        {t('profile.tab.security')}
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        {t('profile.tab.notifications')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            {t('profile.accountInfo')}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="name">
                                    {t('profile.name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={user.name}
                                    className="mt-2"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">
                                    {t('login.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    className="mt-2"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <DisabledNotice />

                            <div className="pt-2">
                                <Button type="button" disabled>
                                    <Save className="mr-2 h-4 w-4" />
                                    {t('profile.saveChanges')}
                                </Button>
                            </div>
                        </div>

                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                {t('profile.dangerZone')}
                            </h3>
                            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                                <p className="text-destructive mb-3 text-sm">
                                    {t('profile.deleteAccountDesc')}
                                </p>
                                <Button variant="destructive" disabled>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    {t('profile.deleteAccount')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            {t('profile.changePassword')}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="current-password">
                                    {t('profile.currentPassword')}
                                </Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    className="mt-2"
                                    disabled
                                />
                            </div>

                            <div>
                                <Label htmlFor="new-password">
                                    {t('profile.newPassword')}
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    className="mt-2"
                                    disabled
                                />
                                <p className="text-muted-foreground mt-1.5 text-sm">
                                    {t('profile.minChars')}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirm-password">
                                    {t('profile.confirmPassword')}
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    className="mt-2"
                                    disabled
                                />
                            </div>

                            <DisabledNotice />

                            <div className="pt-2">
                                <Button type="button" disabled>
                                    <Lock className="mr-2 h-4 w-4" />
                                    {t('profile.updatePassword')}
                                </Button>
                            </div>
                        </div>

                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                {t('profile.twoFactor')}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {t('profile.twoFactorDesc')}
                            </p>
                            <Button variant="outline" disabled>
                                {t('profile.enable2FA')}
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            {t('profile.notifTitle')}
                        </h2>

                        <div className="space-y-6">
                            {[
                                {
                                    title: t('profile.notif.email'),
                                    description: t('profile.notif.emailDesc'),
                                    checked: true,
                                },
                                {
                                    title: t('profile.notif.calendar'),
                                    description: t(
                                        'profile.notif.calendarDesc',
                                    ),
                                    checked: true,
                                },
                                {
                                    title: t('profile.notif.tasks'),
                                    description: t('profile.notif.tasksDesc'),
                                    checked: true,
                                },
                                {
                                    title: t('profile.notif.weekly'),
                                    description: t('profile.notif.weeklyDesc'),
                                    checked: false,
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <p className="text-foreground font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Switch checked={item.checked} disabled />
                                </div>
                            ))}

                            <DisabledNotice />

                            <div className="pt-2">
                                <Button disabled>
                                    <Save className="mr-2 h-4 w-4" />
                                    {t('profile.saveNotif')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

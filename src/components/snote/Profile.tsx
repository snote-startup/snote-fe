'use client';

import { Bell, Info, Lock, Save, ShieldAlert, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/providers/snote-app-provider';

const unavailableMessage =
    'Tính năng này sẽ được mở sau khi backend hoàn thiện.';

function DisabledNotice() {
    return (
        <div className="border-border bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-lg border p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{unavailableMessage}</span>
        </div>
    );
}

export function Profile() {
    const { user } = useApp();

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
                    Hồ sơ
                </h1>
                <p className="text-muted-foreground">
                    Xem thông tin tài khoản và các thiết lập cá nhân.
                </p>
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
                                Tài khoản đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">
                        <User className="mr-2 h-4 w-4" />
                        Tài khoản
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="mr-2 h-4 w-4" />
                        Bảo mật
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Thông báo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            Thông tin tài khoản
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="name">Họ và tên</Label>
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
                                <Label htmlFor="email">Email</Label>
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
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>

                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                Khu vực nguy hiểm
                            </h3>
                            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                                <p className="text-destructive mb-3 text-sm">
                                    Xóa tài khoản cần backend cung cấp API để
                                    đảm bảo dữ liệu được xử lý đúng.
                                </p>
                                <Button variant="destructive" disabled>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Xóa tài khoản
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            Đổi mật khẩu
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="current-password">
                                    Mật khẩu hiện tại
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
                                    Mật khẩu mới
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    className="mt-2"
                                    disabled
                                />
                                <p className="text-muted-foreground mt-1.5 text-sm">
                                    Tối thiểu 8 ký tự.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirm-password">
                                    Xác nhận mật khẩu mới
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
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </div>

                        <div className="border-border mt-8 border-t pt-8">
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                Xác thực hai lớp
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Tăng cường bảo mật cho tài khoản của bạn.
                            </p>
                            <Button variant="outline" disabled>
                                Bật 2FA
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="border-border bg-card rounded-xl border p-6">
                        <h2 className="text-foreground mb-6 text-lg font-semibold">
                            Tùy chọn thông báo
                        </h2>

                        <div className="space-y-6">
                            {[
                                {
                                    title: 'Thông báo email',
                                    description:
                                        'Nhận cập nhật liên quan đến tài khoản.',
                                    checked: true,
                                },
                                {
                                    title: 'Nhắc lịch cuộc họp',
                                    description:
                                        'Nhận nhắc nhở cho sự kiện sắp tới.',
                                    checked: true,
                                },
                                {
                                    title: 'Thông báo công việc',
                                    description:
                                        'Nhận cập nhật khi công việc thay đổi.',
                                    checked: true,
                                },
                                {
                                    title: 'Tổng hợp hằng tuần',
                                    description:
                                        'Nhận tóm tắt các cuộc họp và công việc.',
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
                                    Lưu tùy chọn
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

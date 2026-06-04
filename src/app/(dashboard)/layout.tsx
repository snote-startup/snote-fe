import { Layout } from '@/components/snote/Layout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Layout>{children}</Layout>;
}

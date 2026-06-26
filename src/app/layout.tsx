import type { Metadata } from 'next';
import { Geist_Mono, Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';

const montserrat = Montserrat({
    variable: '--font-snote',
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Snote - Transcript cuộc họp với trợ lý AI',
    description:
        'Tải audio cuộc họp lên, tạo transcript và chat với AI có nguồn tham chiếu từ transcript.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
            <body
                className={`${montserrat.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    );
}

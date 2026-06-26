import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';

const snoteFont = localFont({
    src: [
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Thin.otf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-ExtraLight.otf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-SemiBold.otf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-ExtraBold.otf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Black.otf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-ThinItalic.otf',
            weight: '100',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-ExtraLightItalic.otf',
            weight: '200',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-LightItalic.otf',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-Italic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-MediumItalic.otf',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-SemiBoldItalic.otf',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-BoldItalic.otf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-ExtraBoldItalic.otf',
            weight: '800',
            style: 'italic',
        },
        {
            path: '../../public/fonts/montserrat-vietnamized/Montserrat-BlackItalic.otf',
            weight: '900',
            style: 'italic',
        },
    ],
    variable: '--font-snote',
    display: 'swap',
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
                className={`${snoteFont.variable} ${snoteFont.className} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    );
}

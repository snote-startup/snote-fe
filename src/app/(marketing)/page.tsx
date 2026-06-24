import type { Metadata } from 'next';
import { LandingPage } from '@/components/snote/LandingPage';

export const metadata: Metadata = {
    title: 'Snote - Transcript cuộc họp với trợ lý AI',
    description:
        'Tải audio cuộc họp lên, tạo transcript và chat với AI có nguồn tham chiếu từ transcript.',
};

export default function Home() {
    return <LandingPage />;
}

import type { Metadata } from 'next';
import { LandingPage } from '@/components/snote/LandingPage';

export const metadata: Metadata = {
    title: 'Snote — AI meeting transcripts with grounded answers',
    description:
        'Upload meeting audio, generate transcripts, and chat with AI answers linked to transcript references. Source-grounded AI for every meeting.',
};

export default function Home() {
    return <LandingPage />;
}

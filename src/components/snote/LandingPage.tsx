'use client';

/**
 * Snote landing page.
 *
 * Sections:
 *  1. LandingNavbar
 *  2. Hero + workspace preview
 *  3. Workflow
 *  4. GroundedAnswersSection
 *  5. UseCases
 *  6. LandingFooter
 */

import { LandingNavbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { Workflow } from './landing/Workflow';
import { GroundedAnswersSection } from './landing/GroundedAnswersSection';
import { UseCases } from './landing/UseCases';
import { LandingFooter } from './landing/LandingFooter';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100">
            <LandingNavbar />
            <Hero />
            <Workflow />
            <GroundedAnswersSection />
            <UseCases />
            <LandingFooter />
        </div>
    );
}

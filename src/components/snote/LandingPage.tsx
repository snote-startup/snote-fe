'use client';

/**
 * Snote Landing Page — Cinematic Dark Design
 *
 * Sections (in order):
 *  1. LandingNavbar           — floating glass nav, dark
 *  2. Hero + HeroWorkspaceMock — cinematic hero with command-center mock
 *  3. Workflow                — 4-step agentic pipeline
 *  4. GroundedAnswersSection  — product proof / references
 *  5. UseCases               — 5 use-case cards
 *  6. LandingFooter           — CTA + footer combined
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

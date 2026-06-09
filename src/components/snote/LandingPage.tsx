'use client';

/**
 * Snote Enterprise Landing Page
 *
 * Sections (in order):
 *  1. Navbar          — sticky, blur, mobile drawer
 *  2. Hero            — headline + product preview right
 *  3. TrustStrip      — lightweight credibility strip ("used across teams for...")
 *  4. FeatureBento    — bento grid 6 features (21st.dev bento pattern)
 *  5. Workflow        — 4-step how-it-works
 *  6. UseCases        — 3 cards: product / client / research
 *  7. AIChatDemo      — transcript + AI Q&A split view
 *  8. Security        — 4 honest enterprise-readiness points
 *  9. Testimonials    — 3 neutral placeholder quotes
 * 10. PricingTeaser   — free/pro teaser, no fake prices
 * 11. FAQ             — 5 questions, accordion
 * 12. FinalCTA        — "ready to review your next meeting?"
 * 13. Footer          — brand + link columns
 */

import { LandingNavbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { TrustStrip } from './landing/TrustStrip';
import { FeatureBento } from './landing/FeatureBento';
import { Workflow } from './landing/Workflow';
import { UseCases } from './landing/UseCases';
import { AIChatDemo } from './landing/AIChatDemo';
import { Security } from './landing/Security';
import { Testimonials } from './landing/Testimonials';
import { PricingTeaser } from './landing/PricingTeaser';
import { FAQ } from './landing/FAQ';
import { FinalCTA } from './landing/FinalCTA';
import { Footer } from './landing/Footer';

export function LandingPage() {
    return (
        <div className="bg-background text-foreground min-h-screen">
            <LandingNavbar />
            <Hero />
            <TrustStrip />
            <FeatureBento />
            <Workflow />
            <UseCases />
            <AIChatDemo />
            <Security />
            <Testimonials />
            <PricingTeaser />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}

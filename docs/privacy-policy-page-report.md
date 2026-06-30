## Summary

Added a public Privacy Policy page for Snote at `/policy` for Google Play Console review.

## Route

- Route: `/policy`
- File: `src/app/policy/page.tsx`
- Metadata title: `Privacy Policy | Snote`
- Metadata description: included

## Public Access

- The route is outside the dashboard route group and does not use dashboard/sidebar chrome.
- `/policy` is not listed in the auth guard protected prefixes.
- The page is static content and does not require login.
- A footer link to `/policy` was added to the public marketing footer.

## Policy Sections Included

- Overview
- Information We Collect
- How We Use Information
- Audio, Transcript, and AI Processing
- Sharing of Information
- Data Retention and Deletion
- Security
- Children's Privacy
- International Processing
- Changes to This Policy
- Contact

## Google Play Notes

- The page title is clearly `Privacy Policy`.
- The policy explicitly applies to the app `Snote`.
- Developer/app contact is listed as `privacy@snote.app`.
- The page describes collected/accessed/used/shared data categories.
- The page states that Snote does not sell personal data.
- The page includes security, retention, deletion, service provider, and update language.
- Last updated date: June 30, 2026.

## Data Safety Notes

Likely categories Snote collects based on current frontend/API usage:

- Personal info: email/name
- Audio files: user uploaded/recorded audio
- App activity/user content: projects, transcripts, chat prompts, generated tasks
- Diagnostics: logs/error data if applicable
- Financial info: payment status/order reference only if applicable; full payment details handled by payment provider
- Analytics: Vercel Analytics is present in the root app layout

Ensure the Google Play Data Safety form matches the final production behavior and backend providers.

## Validation

- `bun run lint`: pass
- `bun run build`: pass
- Dev smoke with `rm -rf .next && bun run dev`: pass on `http://localhost:3000`
- `/policy` no-cookie/logged-out HTTP check: pass, returned `200 OK` and policy HTML with title/contact/last updated text
- Existing routes `/`, `/login`, `/dashboard`, `/meetings`: pass, each returned `200`

## Remaining Manual Steps

- Replace contact email if needed.
- Deploy to production.
- Open `/policy` in incognito.
- Paste the final public URL into Google Play Console > Policy and programs > App content > Privacy Policy.
- Ensure Data Safety answers match this policy.

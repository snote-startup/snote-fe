## Summary

Added a public Snote account and data deletion request page for Google Play Console review. The page explains the deletion request flow, ownership verification, data types covered, processing time, and support contact.

## Route

`/snote/account-deletion`

## Public Access

The route is outside the protected dashboard, meeting, billing, profile, task, calendar, live assistant, and admin route prefixes. It does not require login and does not call backend APIs.

## Request Flow

Users enter the email address associated with their Snote account, choose whether they want full account deletion or specific data deletion, and optionally add a note. Submitting the form opens a prepared `mailto:` request to `namdangcoder@gmail.com`.

## Data Covered

- Account information such as email address and display name
- Projects and project metadata
- Uploaded or recorded audio files
- Transcripts
- AI chat messages and generated answers
- Generated tasks and related app data

## Google Play Notes

The page is public, names the app as Snote, provides an external deletion request path, explains possible ownership confirmation, states a 30-day processing target, and does not request a password.

## Validation

- `bun run lint`: pass
- `bun run build`: pass
- Dev smoke: pass
  - `GET /snote/account-deletion`: 200
  - `GET /policy`: 200
  - `GET /`: 200
  - `GET /login`: 200
  - `GET /dashboard`: 200
  - `GET /meetings`: 200
  - Verified the page HTML includes the account deletion heading, support email, form fields, and privacy policy link.
  - Verified the form implementation validates email input, uses `encodeURIComponent`, generates a `mailto:` request, and does not request a password.

## Remaining Manual Steps

Deploy to production.
Open `/snote/account-deletion` in incognito.
Paste the final public URL into Google Play Console account deletion/data deletion URL field.
Ensure Data Safety answers match the privacy policy and deletion page.
Add an in-app path/link to this deletion page if required by the mobile app flow.

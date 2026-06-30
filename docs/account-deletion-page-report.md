## Summary

Implemented the public Snote account and data deletion page for Google Play Console review. The page supports both full account deletion requests and partial data deletion requests without deleting the account.

## Route

The public route is `/snote/account-deletion`.

The page includes anchors for `/snote/account-deletion#delete-account` and `/snote/account-deletion#delete-data`.

## Public Access

The route is implemented as a public App Router page and does not require login, cookies, dashboard layout, password entry, or backend API routes.

## Request Types

The form supports:

- Delete my Snote account and all associated data
- Delete specific data only, without deleting my account

## Partial Data Deletion Support

Partial deletion shows a checklist for projects, transcripts, uploaded audio files, notes or text content, AI chat messages, and other data. At least one data type is required for partial deletion requests.

## Form Fields

The form includes the account email, request type, conditional data type checklist, additional details, and a required ownership verification confirmation checkbox.

## Mailto Flow

Submitting the form validates all required fields, prepares a mailto message to `namdangcoder@gmail.com`, and opens the user's email client. A fallback card appears with the generated recipient, subject, body, and a copy button.

## Google Play Notes

The page states that deletion requests are manually reviewed and processed by the Snote team. It explains full account deletion, partial data deletion, ownership verification, expected processing time, data that may be deleted, and data that may be retained for limited reasons.

## Validation

- `bun run lint`
- `bun run build`
- Dev smoke with `rm -rf .next` and `bun run dev`
- Manual route checks for `/snote/account-deletion`, `/snote/account-deletion#delete-account`, `/snote/account-deletion#delete-data`, `/policy`, `/`, `/login`, `/dashboard`, and `/meetings`

## Remaining Manual Steps

Deploy to production.
Open /snote/account-deletion in incognito.
Paste the final public URL into Google Play Console account deletion/data deletion URL field.
Ensure Data Safety answers match the privacy policy and deletion page.
Ensure the mobile app includes an in-app path/link to this deletion page.

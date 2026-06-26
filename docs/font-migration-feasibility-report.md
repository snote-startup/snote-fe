## Summary

Font migration to the exact requested “Montserrat Việt hoá” package is **blocked**.

No design-provided font files were found in the repo, and the requested source URL could not be verified reliably during this audit. No font files were downloaded or committed.

## Current Font Setup

Current global setup:

- `src/app/layout.tsx` imports `Geist` and `Geist_Mono` from `next/font/google`.
- `body` applies `--font-geist-sans` and `--font-geist-mono`.
- `src/app/globals.css` maps Tailwind theme font variables:
  - `--font-sans: var(--font-sans)`
  - `--font-mono: var(--font-geist-mono)`
  - `--font-heading: var(--font-sans)`
- `html` applies `font-sans`.
- `tailwind.config.ts` does not define a custom font family, only font weights.

Next.js 16 local font guidance was checked in `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`. The recommended path for project-owned font files is `next/font/local`, with paths resolved relative to the file where `localFont` is called.

## Requested Font

Design request:

- `https://fonttiengviet.com/font/font-viet-hoa-montserrat-19-font/`
- Exact package requested: “Font việt hoá Montserrat (19 font)”

External reference notes:

- Search results identify the requested page as a Vietnamized Montserrat package.
- Google Fonts Montserrat itself is available under the SIL Open Font License, but that is not proof that the third-party “Việt hoá” package from the requested site is licensed and approved for this project.

## Asset/License Status

Repo scan found no local font files:

- No `public/fonts/montserrat-vietnamized/*.woff2`
- No `.woff`, `.woff2`, `.ttf`, or `.otf` Montserrat assets under `public` or `src`

License/asset verification:

- The requested Fonttiengviet URL was attempted but returned `502` through the web fetch tool.
- No design-provided license confirmation was present in the repo.
- No approved `.woff2`/`.ttf` files were present.

## Implementation Done or Blocked

Implementation status: **Blocked**.

No code font migration was applied because committing or downloading unverified font files would violate the audit constraints.

Safe integration path once assets are provided:

1. Put approved files under `public/fonts/montserrat-vietnamized/`.
2. Use `next/font/local` in `src/app/layout.tsx`.
3. Expose a global variable such as `--font-snote`.
4. Keep fallback stack:

```css
font-family: var(--font-snote), Montserrat, Inter, system-ui, sans-serif;
```

5. Verify Vietnamese UI text:

- `Ghi âm cuộc họp`
- `Nâng cấp Premium`
- `Tạo transcript và sinh task`

## Required Design Assets

Design/team needs to provide:

- Approved `.woff2` files, preferred for web delivery, or `.ttf` if `.woff2` is unavailable.
- Weight/style mapping, for example regular/medium/semibold/bold and italic needs.
- Written usage/license confirmation for this product.
- Confirmation whether Google Fonts Montserrat is acceptable as a fallback or temporary substitute if the exact Vietnamized package is unavailable.

## Visual Risk

- Montserrat metrics differ from Geist, so dense dashboards, tabs, buttons, and cards need visual regression checks after migration.
- Vietnamese diacritics must be checked in compact controls and mobile layouts.
- If only a subset of weights is provided, browser synthetic weight rendering may shift layout or reduce text clarity.

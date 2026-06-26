## Summary

Implemented exact local Vietnamized Montserrat font package from `public/fonts/montserrat-vietnamized`.

The app now uses `next/font/local` for the project-provided Montserrat Việt hoá `.otf` files. Google Montserrat from `next/font/google` was removed; `Geist_Mono` remains for monospace text.

## Current Font Setup

Previous global setup:

- `src/app/layout.tsx` imports `Geist` and `Geist_Mono` from `next/font/google`.
- `body` applies `--font-geist-sans` and `--font-geist-mono`.
- `src/app/globals.css` maps Tailwind theme font variables:
  - `--font-sans: var(--font-sans)`
  - `--font-mono: var(--font-geist-mono)`
  - `--font-heading: var(--font-sans)`
- `html` applies `font-sans`.
- `tailwind.config.ts` does not define a custom font family, only font weights.

Current global setup after local font migration:

- `src/app/layout.tsx` imports `localFont` from `next/font/local` and `Geist_Mono` from `next/font/google`.
- `snoteFont` maps local files from `public/fonts/montserrat-vietnamized`.
- Weights `100` through `900` are mapped for normal style.
- Weights `100` through `900` are mapped for italic style.
- `body` applies `snoteFont.variable`, `snoteFont.className`, and `--font-geist-mono`.
- `src/app/globals.css` maps:
  - `--font-sans: var(--font-snote), Montserrat, Inter, system-ui, sans-serif`
  - `--font-mono: var(--font-geist-mono)`
  - `--font-heading: var(--font-snote), Montserrat, Inter, system-ui, sans-serif`
- `src/app/globals.css` applies the font stack to `html` and `body`.
- `button`, `input`, `textarea`, and `select` inherit the local UI font.

Next.js 16 local font guidance was checked in `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`. The recommended path for project-owned font files is `next/font/local`, with paths resolved relative to the file where `localFont` is called.

## Requested Font

Design request:

- `https://fonttiengviet.com/font/font-viet-hoa-montserrat-19-font/`
- Exact package requested: “Font việt hoá Montserrat (19 font)”

External reference notes:

- Search results identify the requested page as a Vietnamized Montserrat package.
- Google Fonts Montserrat itself is available under the SIL Open Font License, but that is not proof that the third-party “Việt hoá” package from the requested site is licensed and approved for this project.

## Asset/License Status

Repo local font files now present:

- `public/fonts/montserrat-vietnamized/*.otf`
- `public/fonts/montserrat-vietnamized/SIL Open Font License.txt`

License/asset verification:

- The requested Fonttiengviet URL was attempted but returned `502` through the web fetch tool.
- The repo now includes `SIL Open Font License.txt` alongside the provided `.otf` files.
- No zip files were committed.

## Implementation Done or Blocked

Implementation status: **Implemented exact local Vietnamized Montserrat font package**.

Implemented exact local Vietnamized Montserrat font package from `public/fonts/montserrat-vietnamized`. Used `next/font/local`. Mapped weights `100`-`900` normal and `100`-`900` italic where files exist. Google Montserrat from `next/font/google` was removed. Body uses `snoteFont.className` plus the `--font-snote` variable. Global CSS applies font to `html`, `body`, and form controls.

Applied files:

1. `src/app/layout.tsx`
2. `src/app/globals.css`
3. `public/fonts/montserrat-vietnamized/`

Fallback stack:

```css
font-family: var(--font-snote), Montserrat, Inter, system-ui, sans-serif;
```

Vietnamese UI text to verify:

- `Ghi âm cuộc họp`
- `Nâng cấp Premium`
- `Tạo transcript và sinh task`

## Retry With Env File Token

Previous font migration result:

- Implemented pragmatic Montserrat migration using `next/font/google`.
- Exact third-party Vietnamized Montserrat local package remains pending design-provided files/license.
- No font files were downloaded from the requested website.
- No font files were committed.

Vietnamese visual smoke targets:

- `Ghi âm cuộc họp`
- `Nâng cấp Premium`
- `Tạo transcript và sinh task`
- `Bảng công việc`
- `Gói dịch vụ`

### Resume Retry After Account Switch

Verification results:

- `bun run lint`: pass
- `bun run build`: pass
- Dev route smoke: pass for `/`, `/dashboard`, `/meetings`, `/meetings/c1aa6eac-4c0d-4631-921b-a8ff20155603`, `/tasks`, `/billing`, `/billing/success`, `/profile`
- Runtime font smoke: pass at route/render level; SSR output includes the generated Montserrat variable class on `<body>` and Next font `.woff2` preloads

Font asset status:

- No downloaded third-party font files were found under `public` or `src`.
- Exact design font local files are still pending.
- `subsets: ['latin', 'vietnamese']` builds successfully with Next.js `16.2.6`.

### Local Font Package Applied

Implementation result:

- Implemented exact local Vietnamized Montserrat font package from `public/fonts/montserrat-vietnamized`.
- Used `next/font/local`.
- Mapped weights `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, and `900` for normal style.
- Mapped weights `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, and `900` for italic style.
- Google Montserrat from `next/font/google` removed.
- Body uses `snoteFont.className` and `--font-snote`.
- Global CSS applies the font to `html`, `body`, `button`, `input`, `textarea`, and `select`.
- `Geist_Mono` remains for `--font-geist-mono`.

## Future Design Assets

Optional future improvements:

- Provide `.woff2` versions if design wants smaller web font payloads than `.otf`.
- Confirm whether `MontserratAlternates-ThinItalic.otf` should be used anywhere; it is not part of the current global UI font mapping.
- Keep written usage/license confirmation with the provided `SIL Open Font License.txt`.

## Visual Risk

- Montserrat metrics differ from Geist, so dense dashboards, tabs, buttons, and cards need visual regression checks after migration.
- Vietnamese diacritics must be checked in compact controls and mobile layouts.
- If only a subset of weights is provided, browser synthetic weight rendering may shift layout or reduce text clarity.

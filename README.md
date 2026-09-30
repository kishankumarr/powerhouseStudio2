# Powerhouse Studios website

Marketing site for Powerhouse Studios, a creative and production company in Mangaluru, Karnataka. It is built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion 13 (formerly Framer Motion) and Redux Toolkit.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

Node 20.9 or newer is required.

## Checks

| Command                              | What it does                                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint` / `npm run typecheck` | ESLint (flat config, no copy in JSX) and `tsc --noEmit`                                                                                                             |
| `npm test`                           | Vitest unit tests: content integrity, SEO limits, theme registry, preferences store, JSON-LD, enquiry form                                                          |
| `npm run test:e2e`                   | Playwright against a production build on port 3100: smoke, SEO, axe (every page × both looks), responsive (320–1920 px), themes, mobile menu, reduced motion, links |
| `npm run check:contrast`             | WCAG contrast gate over every theme and tone                                                                                                                        |
| `npm run check:images`               | Confirms every photo URL returns 200 from an allowed host                                                                                                           |
| `npm run logo`                       | Re-traces `brand_assets/kogo.png` into `src/components/brand/logo-paths.ts` and the SVG/PNG icons                                                                   |

A pre-commit hook runs Prettier and ESLint on staged files.

## CI/CD (GitLab)

`.gitlab-ci.yml` runs these checks on every merge request and push, and builds the app. It then runs Playwright against that build (reports appear in the MR test widget) and deploys to Vercel: a preview for each merge request and production from the default branch.

Deploys only run once these CI/CD variables are set:

- `VERCEL_TOKEN` (masked)
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` (from `.vercel/project.json` after `npx vercel link`)

## The two looks

The client can switch looks from the round button in the bottom-right corner of every page, or on `/config`, which is not indexed.

| Preset                    | Colour                                     | Layout    | Style                                |
| ------------------------- | ------------------------------------------ | --------- | ------------------------------------ |
| **Studio Noir** (default) | black stage, yellow key light, film grain  | cinematic | sharp (cut corners, uppercase)       |
| **Daylight Edit**         | paper white, black ink, yellow highlighter | editorial | rounded (soft radius, sentence case) |

Under **Fine-tune**, colour, layout (cinematic, editorial, blocks) and style (sharp, rounded, condensed) can each be changed independently. The choice is saved on the device. To send someone a specific look, share a link such as `https://powerhousestudios.in/?preset=daylight`; the parameter works on any page.

- The registry lives in `src/config/themes.ts`.
- Tokens live in `src/styles/themes/*.css`: each theme defines a base tone plus `contrast` and `accent` bands.
- Components use semantic tokens only (`bg-bg`, `text-fg`, `bg-accent`…), never raw colours.

## Editing content

All text is in `src/content/en/*.ts`, typed by `src/content/types.ts`. Copy comes from the brand profile (`brand_assets/POWERHOUSE STUDIOS.pdf`). Change it there and the pages, metadata, JSON-LD and OG images follow.

**Awaiting client input.** These are deliberately not invented:

- portfolio projects (typed placeholders in `content/en/work.ts`)
- founder portraits (typographic monograms for now)
- street address, map pin and opening hours (not provided, so not in JSON-LD)
- testimonials and statistics
- a WhatsApp number (only once it's confirmed as WhatsApp-enabled)

## Photos

Every photo is referenced from `src/constants/images.ts`, with its alt text in `src/content/en/images.ts`. They are free-licence Unsplash images, credited in the footer and presented as illustrative, never as Powerhouse's own work.

To use the client's own photos, change `src`, `width`, `height` and `credit` for a key and update its alt text. Keys are semantic (`serviceEventCoverage`), so no component changes are needed.

## Adding a language

Add `src/content/<locale>/` with a `content` object that `satisfies Content`; the compiler lists any missing keys. Then register it in `src/content/index.ts`. The routing step (`app/[lang]`, `proxy.ts`, `alternates.languages`) is described in `.claude/skills/content-i18n/SKILL.md`.

## Contact form

There is no backend yet. The form validates on the client and opens the visitor's email app with a structured message to `team.powerhousestudios@gmail.com`. Sending goes through the `EnquiryTransport` interface in `src/lib/enquiry/transport.ts`, so moving to a Server Action and an email provider later is a one-file change.

## Project guides

The detailed conventions (brand, architecture, themes, motion, SEO, performance and testing) are in `.claude/skills/*/SKILL.md`.

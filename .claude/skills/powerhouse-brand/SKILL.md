---
name: powerhouse-brand
description: Source of truth for the Powerhouse Studios brand (creative & production company in Mangaluru, Karnataka) — identity, logo anatomy, exact colours, voice, the 8 services, audiences, process, founders, FAQ and contact details. Use whenever writing site copy or content files, designing any page, section or theme, building the logo animation, writing SEO metadata or JSON-LD, or checking whether a claim about the company is real.
---

# Powerhouse Studios — Brand Source of Truth

Primary sources (never edit): `brand_assets/kogo.png` (logo, 7620×7620 RGBA, transparent) and `brand_assets/POWERHOUSE STUDIOS.pdf` (17-page brand profile). A faithful transcription of the PDF lives in [references/brand-source.md](references/brand-source.md). Pull copy from there instead of paraphrasing from memory.

## Identity in one breath

Powerhouse Studios is a creative and production company in **Mangaluru, Karnataka** that helps brands become **more visible, more memorable and more impactful**. It brings creative thinking, production expertise and execution under one roof: social media, video, editing, photography, events, studio rental and campaigns.

Core idea: **Visibility → Trust → Growth.**

## Official lines (use verbatim, never reword)

| Use                             | Line                                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Primary tagline / brand promise | We create. We connect. We build brands.                                                            |
| Philosophy chain                | Visibility → Trust → Growth                                                                        |
| Mission formula                 | Strategy + Creativity + Production + Execution                                                     |
| Portfolio line                  | Different brands. Different stories. One Powerhouse approach.                                      |
| Difference line                 | The requirement may change. The approach remains the same — understand, create, execute and build. |
| Event line                      | Powerhouse is a one-stop solution for complete event management.                                   |
| Contact sign-off                | Let's create something powerful.                                                                   |
| Contact opener                  | Have a project in mind? Let's talk.                                                                |

## Logo anatomy (for vectorising and animating)

Read from `kogo.png`. The mark tells the whole service story, so the animation should reveal it in that order:

1. **"PS" monogram**: a flowing ribbon. The **P** and **S** share one continuous stroke with diagonal (~52°) cut terminals that suggest forward motion. It is solid black.
2. **Microphone** (bottom-left, tucked into the P's lower bowl). It stands for audio, podcasts and hosting.
3. **Video camera with play button** (top-right, where the S begins). It stands for video production.
4. **Wordmark pill**: a black rounded rectangle with **POWERHOUSE** in yellow and a white inset pill with **STUDIOS** in black. The type is condensed and geometric, with stadium-shaped (rounded-rectangle) O's.

The mic and the camera sit at opposite ends of the S, like _input → output_. This is a natural animation story: the ribbon draws, the mic pulses, the camera "records" (the play icon blinks), then the wordmark slides in.

## Colour (sampled from the logo, exact)

| Token         | Hex       | Notes                                              |
| ------------- | --------- | -------------------------------------------------- |
| Signal Yellow | `#FEED01` | rgb(254, 237, 1). The only chromatic brand colour. |
| Black         | `#000000` | True black in the logo.                            |
| White         | `#FFFFFF` | The STUDIOS inset.                                 |

Contrast facts (WCAG):

- Black on yellow is **17.3:1**. Use yellow as a _fill_ with black text on it.
- Yellow on black is 17.3:1. Fine for text and icons.
- Yellow on white is **1.2:1** and fails. **Never put yellow text or thin yellow lines on white or light surfaces.** On light themes, yellow is a fill (highlighter, tape, block) with black content.

Themes may add neutrals (warm or cool greys, off-blacks) and at most one supporting hue, but `#FEED01` and black must stay the recognisable core in every theme. See the `theme-system` skill.

## Typography direction

The wordmark is uppercase, condensed and geometric, with squarish, stadium-shaped counters. The display face should echo that. Evaluate against the logo side by side and pick deliberately, not by default. Candidates: _Saira Condensed / Saira ExtraCondensed_, _Barlow Condensed_, _Big Shoulders Display_, _Oswald_. Pair it with a highly legible body face. Load fonts with `next/font` only.

## Voice

- Short, declarative sentences with plain verbs. The source's own rhythm: "Events are experiences." "A great shoot is only the beginning."
- Purpose over polish. The brand explicitly rejects "content for the sake of content", so copy should say _why_, not only _what_.
- Confident without hype. No "world-class", "best-in-class", "revolutionary" or similar.
- **Spelling is British/Indian English**, as in the source: organisation, colour, optimisation, recognisable, décor. Keep it consistent everywhere.
- Warm and local. Mangaluru and coastal Karnataka are a strength ("Local understanding, professional production"). The founders are Tulu-speaking creators, so cultural relevance is a genuine differentiator.

## Services (8)

Use these slugs everywhere: routes, content keys, JSON-LD `@id`s. Full capability lists are in the reference file.

| #   | Slug                      | Name                            | One-line promise (from source)                                      |
| --- | ------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| 1   | `social-media-management` | Social Media Management         | A social presence that feels consistent, recognisable and relevant. |
| 2   | `video-production`        | Video Production                | Video projects from concept to final delivery.                      |
| 3   | `video-editing`           | Video Editing & Post-Production | Raw footage into polished, platform-ready content.                  |
| 4   | `photography`             | Photography                     | A visual library brands can use across their marketing.             |
| 5   | `event-management`        | Event Management & Production   | End-to-end: planning to execution, a one-stop solution.             |
| 6   | `event-coverage`          | Event Coverage                  | Capture the experience, not just what happened.                     |
| 7   | `studio-rentals`          | Studio Rentals                  | A controlled space for professional content production.             |
| 8   | `brand-campaigns`         | Brand Content & Campaigns       | Many deliverables, one connected brand story.                       |

## Other structured facts

- **Audiences:** Businesses & Brands, Creators, Events.
- **Ways to engage (5):** a single project, ongoing content, a campaign, an event, a complete creative partner.
- **Process (a real sequence, so numbered markers are fine):** 1 Understand, 2 Create, 3 Produce, 4 Deliver. It is preceded by six discovery questions.
- **Why Powerhouse (6):** One Creative Partner; Creative + Execution; Content That Has Purpose; Flexible Production; End-to-End Capability; Local Understanding, Professional Production.
- **Industries (16):** Retail, Restaurants, Hospitality, Healthcare, Education, Real estate, Fitness, Lifestyle, Fashion, Automotive, Corporate brands, Events, Personal brands, Creators, Startups, Local businesses.
- **Philosophy reasons (12):** see the reference file. These suit a kinetic marquee or ticker.
- **Founders:**
  - **Sharan Chilimbi**, Co-Founder, Creative & Content. Tulu creator, influencer, host, actor, dancer and YouTuber.
  - **Shravan Rajani** ("Shravan Bro"), Co-Founder, Digital & Creative Strategy. Fitness creator and entrepreneur.
- **Vision:** a leading creative and production company from Mangaluru, reaching audiences beyond the region.

## Contact (canonical formats)

| Field     | Display                          | Machine value                                                                |
| --------- | -------------------------------- | ---------------------------------------------------------------------------- |
| Location  | Mangaluru, Karnataka             | addressLocality `Mangaluru`, addressRegion `Karnataka`, addressCountry `IN`  |
| Phone     | 80504 61707                      | `tel:+918050461707`                                                          |
| Email     | team.powerhousestudios@gmail.com | `mailto:team.powerhousestudios@gmail.com`                                    |
| Instagram | @powerhousestudios.in            | `https://www.instagram.com/powerhousestudios.in/`                            |
| Website   | powerhousestudios.in             | `https://powerhousestudios.in` (used as `metadataBase` and canonical origin) |

No street address, opening hours or map pin was provided. Do not invent them.

## Content integrity rules (non-negotiable)

The client will read every word. Anything invented damages trust and could mislead their customers.

1. **Do not fabricate** client names or logos, testimonials, reviews, ratings, project counts, "years of experience", follower numbers, awards, pricing, team size, equipment lists, studio dimensions or a street address.
2. When a layout needs such data (portfolio, testimonials, stats), put a clearly typed placeholder in the content file (`{ placeholder: true, note: 'Awaiting client input' }`). Render it as an obvious, tasteful "coming soon" state, or omit the section. Never ship fake-real content.
3. **Stock imagery is illustrative.** Never caption stock photos as Powerhouse's own work, clients or founders. The founders have no photos yet, so use typographic or monogram treatments, not stock faces.
4. New marketing copy is fine when it **expands** what the source says (for example, a sentence describing what a brand film is). It must not add capabilities, locations or guarantees the source does not state. When in doubt, quote the source.

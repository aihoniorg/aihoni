# aihoni

A navigable React implementation of the **Aihoni Signup Flow** design — a
voice-first AI assistant app for Nepali businesses (ChatGPT/Claude-style,
built around Nepali payment gateways like eSewa, Khalti, IME Pay and
ConnectIPS).

This was built from a Claude Design handoff bundle. The original prototypes
were HTML/CSS/JS mockups; this repo recreates them as a real, navigable
React + TypeScript app.

## Stack

- **Vite** + **React 18** + **TypeScript**
- No UI framework — the design system is hand-built with inline styles and
  CSS custom properties, matching the original prototype's tokens.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## What's implemented

All 22 screens from the design, across four sections, presented inside an
iOS device frame. A left-hand rail lets you jump to any screen; the in-app
controls (Continue buttons, tab bar, back chevrons, list rows) navigate the
flow the way a real app would.

**Welcome** — Welcome · Language · Sign in
**About you** — Personal info · Connect tools · Voice setup
**Your businesses** — Add business · Business details (map + voice-fill) ·
Business dashboard · Knowledge base
**The app** — Chats · Feed · Snap camera · Group chat · Chat with aihoni ·
Chat attachments · Chat react & reply · Reels · Order from reel ·
Business page · Profile · Recharge points

### Navigation

- The **onboarding flow** (screens 1–10) advances linearly via the primary
  CTA on each screen, handing off into the app at **Chats**.
- The **bottom tab bar** switches between Chat / Feed / Snap / Reels /
  Profile.
- Taps wired through the app: chat-list rows open the relevant conversation,
  feed/reel store headers open the Business page, the Reels "Order" button
  opens the order sheet, and the Profile points card opens Recharge.
- The **back** control and chevrons pop the navigation stack.

## Design system

Tokens live in `src/theme.ts`:

- **Type** — Poppins (UI) + Baloo 2 (the `aihoni.` wordmark)
- **Surface** — white with a subtle dot pattern; neutral greys
  (`#F6F6F6` fills, `#EFECEC` hairlines)
- **Primary** — charcoal `#1B1B1F` (buttons, toggles, selected states)
- **Accent** — a single blue `#3B76EF` (voice/mic, story rings, points,
  badges)

## Project structure

```
src/
  theme.ts              design tokens (CSS custom properties)
  nav.tsx               screen registry IDs + navigation stack
  App.tsx               stage: device frame + screen rail
  components/
    IOSDevice.tsx       iOS bezel / status bar / home indicator
    ui.tsx              shared kit (buttons, fields, orb, tab bar, chat input…)
    StoryRing.tsx       story-ring avatar
    ImageSlot.tsx       media placeholder
  screens/
    index.ts            screen registry (component + label + section)
    *.tsx               one file per screen
```

## Notes

- Image areas (feed photos, reels, camera viewfinder, post grids) render as
  labelled placeholders, mirroring the drag-and-drop image slots in the
  original design tool.
- Screens are faithful visual recreations; interactivity is limited to
  navigation and a few local toggles (Feed filters, Follow, recharge pack /
  payment selection, camera mode).

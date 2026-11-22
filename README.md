# Plan: my trading plan dashboard

My trading plan, made interactive. I open it before and during the New York session: it tells me what to do, checks me against my rules, and stops me from breaking them.

The full build spec is in [`SPEC.md`](./SPEC.md). Design inspiration screenshots are in [`design-refs/`](./design-refs).

## Build progress

| Phase | What | Status |
|---|---|---|
| 1 | Foundation: design system, navigation, all 9 pages, plan data, saving, NY-time helper | ✅ Done |
| 2 | Today + status engine | ⏳ Next |
| 3 | Trade Checklist | |
| 4 | Risk calculators | |
| 5 | Pre-Session, Rules, Playbook, Mindset, Goals | |
| 6 | Settings & polish | |

## Run it on your own computer (optional)

You need [Node.js](https://nodejs.org) (version 20 or newer) installed.

```bash
npm install      # download the libraries (first time only)
npm run dev      # start the app
```

Then open http://localhost:3000. A hidden page showing every design piece is at http://localhost:3000/styleguide.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the app while you work on it (auto-refreshes) |
| `npm run build` | Checks everything and builds the fast production version |
| `npm test` | Runs the automatic tests (New York time logic) |
| `npm run test:tz` | Runs the tests pretending the computer is in Tokyo and Los Angeles |
| `npm run lint` | Looks for common code mistakes |

## Where things live

- `src/data/plan.ts`: **my whole trading plan as data** (rules, checklists, numbers). Edit this to change the default plan.
- `src/data/types.ts`: the "shape" of the plan.
- `src/lib/time.ts`: every New York time calculation (always `America/New_York`, whatever my computer's time zone).
- `src/store/usePlanStore.ts`: what the app remembers (saved in the browser's localStorage).
- `src/components/ui-kit/`: the reusable design pieces (pills, stat tiles, cards…).
- `src/components/shell/`: sidebar, top bar, mobile bottom nav.
- `src/app/`: one folder per page.

Keyboard shortcuts: `1`–`9` jump to sections, `[` collapses the sidebar.

Everything is saved in the browser only: no account, no server, no database.

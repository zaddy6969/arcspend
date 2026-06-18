# ArcSpend

ArcSpend is a premium, investor-demo-ready crypto expense management experience built for Arc wallets. It turns portfolio activity into a polished product surface with wallet analytics, AI-style insight panels, transaction intelligence, and guided transfer, swap, and bridge flows.

Live demo: [https://arcspend.vercel.app](https://arcspend.vercel.app)

## What’s included

- Premium landing page and dashboard with portfolio KPIs, wallet switching, quick actions, and animated counters
- Analytics surface with daily, weekly, monthly, and yearly trend views plus budget and forecast panels
- Card-based transaction feed with search, filters, sorting, CSV export, and infinite scrolling
- Multi-wallet portfolio management for spending, trading, and treasury scenarios
- Submission-ready send/receive, swap, and bridge flows with previews and polished states
- Presentation-mode data model so the live product always opens in a strong demo state

## Submission framing

ArcSpend is intentionally packaged as a polished product demo:

- The app opens with curated portfolio data so every route is immediately explorable
- AI surfaces are demonstrated through deterministic insight logic and productized recommendations
- The experience is optimized for walkthroughs, investor demos, and hackathon judging

## Core routes

- `/` landing page
- `/dashboard` executive overview
- `/analytics` trends, budgets, and forecast
- `/transactions` searchable activity feed
- `/wallets` multi-wallet and asset allocation view
- `/transfer` send and receive experience
- `/swap` token swap flow
- `/bridge` cross-chain bridge flow
- `/settings` presentation and local preferences

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

- GitHub: `zaddy6969/arcspend`
- Deployment: Vercel
- Default live domain: [https://arcspend.vercel.app](https://arcspend.vercel.app)

## Demo walkthrough

For a concise submission walkthrough:

1. Start on the landing page.
2. Open the dashboard and switch between wallets.
3. Visit analytics to show trends, budget controls, and forecast.
4. Open transactions to demonstrate search, filters, and CSV export.
5. Finish with transfer, swap, and bridge to show the full product depth.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Votico is a Bitcoin DAO governance platform ("Unlocking Decentralized Governance for Bitcoin Communities") — a React SPA with Bitcoin multisig wallet integration and on-chain proposal/voting logic.

## Commands

```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (strict, --max-warnings=0 — zero warnings allowed)
npm run preview   # Preview production build locally
```

## Architecture

### Tech Stack
- **React 18** + **TypeScript** (strict mode) + **Vite/SWC**
- **Jotai** for global state (atoms, not Redux)
- **React Router v6** (`createBrowserRouter`, nested routes)
- **Axios** with interceptors for API calls
- **Tailwind CSS** + **SCSS modules** (mixed styling approach)
- **bitcoinjs-lib**, **@scure/btc-signer**, **Ledger SDK**, **sats-connect** for Bitcoin/wallet support

### API Layer (`src/api/`)
- `instance.ts` — Axios instance with dynamic `baseURL` derived from hostname: `localhost` → `https://api.dev.voti.co/api/v1/`; `app.voti.co` or any other host → `https://api.voti.co/api/v1/`
- Response interceptor auto-refreshes tokens on 401; clears localStorage and reloads on invalid refresh token
- Auth: `bitcoinLogin()` (standard wallet signature) and `hardwareLogin()` (Ledger)

### State Management (`src/store/`)
- Jotai atoms; key hooks: `useAddress()`, `useNetwork()`, `useProjects()`, `useProposals()`
- Atoms persist to `localStorage` via `atomWithStorage` wrapper in `src/utils/storeUtils.ts`

### Routing (`src/app/utils/router.tsx`)
- Root: `/` → Explore, `/timeline/:projectId?`, `/proposal/:proposalId`
- Protected: `/profile/:projectId` (wraps children in `<AuthRoute>`) with sub-routes `/voting`, `/proposal`, `/members`, `/assets`
- Route path constants live in `src/constants/paths.ts`

### Component Conventions
Every component lives in its own folder:
```
ComponentName/
├── index.tsx              # Main component (export default, often React.memo)
├── index.module.scss      # Scoped SCSS
├── types.d.ts             # Local types
└── components/            # Nested sub-components (same structure)
    └── SubComponent/
└── utils/
    └── images/index.ts    # Import/export all images used by this component
```
- Data-fetching logic goes in a **local hook** inside the component folder — components only call hooks and receive data/methods
- Styling: SCSS modules for component-scoped styles, Tailwind utility classes inline

### Design System (`src/kit/`)
Base primitives: `Button`, `Input`, `TextArea`, `Modal`, `Dropdown`, `ComboBox`, `DatePicker`, `Toggle`, `Skeleton`, `Text`, `Image`. Always prefer kit components over HTML primitives.

### Path Aliases (tsconfig)
```
@/*            → src/*
@components    → src/components
@kit           → src/kit
@api/*         → src/api/*
@pages/*       → src/pages/*
@images/*      → src/assets/images/*
@constants/*   → src/constants/*
@hooks         → src/hooks
@types         → src/types
@store         → src/store (root + subdirs)
@utils         → src/utils
```

### Custom Tailwind Config
- Brand yellow: `primary` (`#ffb21d`) with opacity variants (`primary/3`, `/5`, `/10`, `/20`, `/30`)
- Custom font-size utilities: `b34`/`b32` (bold), `s22`/`s18`/`s16` (semibold), `m18`/`m16`/`m14` (medium), `r14`/`r13`/`r12` (regular)
- Custom spacing scale: 0–100rem in 4rem steps

### Vite Plugins
- `nodePolyfills()` — Buffer/crypto polyfills for Bitcoin libs
- `wasm()` — WebAssembly support
- `svgr()` — SVGs imported as React components

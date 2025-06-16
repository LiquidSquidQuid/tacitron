# Tacitron

## Overview

Layers command fleets of unique ships, each with distinct abilities and roles, in fast-paced tactical battles within a dark, minimalist cyber‑punk dashboard.

## Game Features

* **Deep Tactics**: 6×6 board with 6 ship archetypes and 9 ability modules
* **Strategic Depth**: \~500 viable squad combinations
* **Quick Matches**: Average game length of 4–6 rounds (\~30 s playback)
* **Fair Monetization**: Cosmetic-only microtransactions
* **Seasonal Progression**: 30-tier system with free and premium tracks

## Ship Archetypes

* **Interceptor**: Burst damage specialist
* **Support Frigate**: Team buffer and healer
* **Shield Tank**: Frontline defender
* **Artillery Cruiser**: Long-range AoE damage
* **Drone Carrier**: Summoner and chip damage
* **Saboteur Corvette**: Debuff specialist

---

A tactical space combat game featuring deep strategy in a compact 6×6 grid set in a dark, minimalist cyber‑punk dashboard style. Players are **Pilots of the Last Firewall**, defending the Core Nexus against the Sentient Grid’s AI incursions.

## Story & Seasons

Each **4-week Season** is a themed System Incursion by the Sentient Grid—an AI network consuming the Core Nexus. Players, as elite pilots, reclaim subsystems and unlock new tools to push back.

* **Season 1: Neon Dawn**

  * Threat: Drone Swarm (Interceptor‑heavy AI)
  * Unlock: Netbreaker Module (Utility “Phase Flash”)
* **Season 2: Iron Curtain**

  * Threat: Shield Nexus AI (Tank variants)
  * Unlock: Shield Shatter Weapon
* **Season 3: Pulse Revolt**

  * Threat: Saboteur Collective (jam‑bots)
  * Unlock: Overclock Patch

Meta‑campaign: victory grants **System Points**, driving an endless narrative of defense—the Grid never fully surrenders.

## Core Gameplay

* **Board**: 6×6 turn‑based grid, matches \~4–6 rounds (\~30 s playback).

* **Bandwidth (Quantum Throughput)**:

  * Fixed cap: ⌊PlayerPower / 10⌋ per session
  * Regenerates +1 BP every 6 s (→10 BP/min) up to cap
  * **Free users**: up to 2 h regen per rolling 24 h
  * **Paid users**: unlimited regen

* **Action Costs**:

  * Basic Attack = 10 BP
  * Module Ability = 15–25 BP
  * Movement = 5 BP

* **Turn Structure**: Each round, players and AI spend BP to act; unused BP carries over.

### Rotating Particle Visuals

Ship aura is represented by animated particle clouds (via Lottie), shaped by archetype (sphere, cube, pyramid), colored by level (blue→magenta), with density reflecting modules equipped.

## Commands & Console UI

Interact via a sleek, dark console dashboard with subtle blue/pink/purple accents:

| Command  | Description                                               |
| -------- | --------------------------------------------------------- |
| `deploy` | Auto‑match into a 6×6 skirmish at your Player Power level |
| `scan`   | Leaderboard & matchmaking (AI or real)                    |
| `hub`    | Manage fleet: view, craft, or upgrade ships using Alloy   |
| `pass`   | View season progression, free vs paid tiers, and rewards  |
| `help`   | List available commands & hotkeys                         |

## HUD Metrics

Top bar displays:

* ⚡ **Energy**
* 🛠️ **Alloy**
* 🔋 **Player Power**
* 🛡️ **Season Tier** (Free vs Paid progress)

## Progression & Monetization

* **Free Track**: Earn Alloy, module shards, and cosmetics every 5 tiers.
* **Paid Track** (\$4.99, non‑consumable): Double rewards, exclusive skins, and early module unlocks.
* **Cosmetic IAP**: Optional blueprint crates for hull skins only (no gameplay effect).

No forced ads; only an optional rewarded ad to refill Energy.

## Development Setup

1. **Clone** the repository
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm start` (Expo for iOS, Android, Web)

### Tech Stack

* **Frontend**: Expo SDK (React Native + Web), Expo Router, Tailwind RN
* **Backend**: Supabase (Postgres, Auth, RLS, Functions)
* **IAP**: RevenueCat
* **Analytics**: PostHog
* **Art & Animation**: Midjourney (sprites), Lottie (visuals)
* **AI Tools**: Cursor (IDE), Claude Code (codegen)

## License

MIT

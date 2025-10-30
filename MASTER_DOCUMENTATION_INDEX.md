populateQuickFacts(geocodeData, countryData);
populateComparison(distance, bearing, geocodeData);
populateAIFacts(facts);
populatePhotos(photos);
# 🗺️ Master Documentation Index – Geography Detective Academy

**Version:** 4.0  
**Last Updated:** October 29, 2025  
**Maintainer:** GitHub Copilot (repository-wide documentation audit)

This index is the authoritative guide to every working component of the Geography Detective Academy web application. It complements `DOCUMENTATION_INDEX.md` by diving into the web app’s structure, dependencies, and feature modules.

---

## 📌 Orientation

| If you need… | Start here |
| --- | --- |
| High-level briefing | `EXECUTIVE_SUMMARY.md`, `REALISTIC_ASSESSMENT.md` |
| Classroom operations | `USER_INSTRUCTIONS.md`, `NUCLEAR_SAFETY_SYSTEM.md` |
| Developer entry point | `README.md` → `CODE_ARCHITECTURE.md` → this document |
| Bug triage | `BUGS_DETAILED.md`, `CRITICAL_BUGS_FIXED.md` |
| Deployment guidance | `DEPLOYMENT_GUIDE.md`, `NETLIFY_DEPLOYMENT_CHECKLIST.md` |

### Primary Code Assets

| File | Description |
| --- | --- |
| `index.html` | Main single-page app (~10.7K lines) containing UI, map logic, game modes, AI pipelines, achievements, and Supabase client code. |
| `real-life-facts.js` | Supplemental fact bank for Geography-in-Real-Life card. |
| `photo-modal-functions.js` | Shared JS for photo modal open/close interactions. |
| `/netlify/functions/*.js` | Node-based serverless endpoints (AI, photos, weather, safety). |
| `/assets/**/*` | Static assets (icons, emoji art, CSS overrides, audio). |
| `local-dev-server.js` | Lightweight proxy for Netlify Functions during local development. |
| `ocean-explorer-v3.html` | Standalone Ocean Explorer experience (optional module, still maintained). |

---

## 🧱 Architecture at a Glance (index.html)

```
index.html
├── <head> Styles + third-party includes (Leaflet, Supabase)
├── <body>
│   ├── Header: XP display, logout, fun-mode toggle (future)
│   ├── Mode bar: Explore, Mystery, Scavenger, Guess, Missions, Create, Alaska, Ocean link
│   ├── Main layout: Map canvas + sidebar card stack
│   ├── Game panels: Conditional DOM for each mode
│   ├── Modals: Quiz modal, achievement toasts, reset dialogs
│   └── Notification layer: Toasts, loading animations ("67"), warnings
└── <script>
    ├── Global state + constants (map, achievements, Supabase client)
    ├── Initialization (Leaflet map, listeners, fetch throttling)
    ├── Location Explorer modules (geocoding, cards, AI facts)
    ├── Game mode controllers (Mystery, Scavenger, Guess, Missions, Create, Alaska)
    ├── Achievement + XP system (checks, unlock animations, persistence)
    ├── Safety filters (keyword scan, rejection messaging)
    ├── Netlify function wrappers (AI, photos, weather, Overpass)
    └── Utility helpers (formatting, distance calculations, throttling guards)
```

### Key Subsystems

| Module | Responsibility | Anchor Comments |
| --- | --- | --- |
| Map bootstrap | Initializes Leaflet map, base layers, marker icon config, explore click handler. | `// Initialize map and set default view` |
| Location Explorer | Reverse geocoding, country lookup, distance/bearing, AI card population, photo modal wiring. | `// POPULATE LOCATION DATA (Explore mode)` |
| Safety Layer | Nuclear filter prompts, post-generation scrub, Vision AI matching integration. | `// NUCLEAR SAFETY FILTER` |
| Game Modes | State machines for Mystery, Scavenger, Guess, Missions, Create Heist, Alaska Adventure. Each mode toggles DOM panels and registers event listeners. | `// ================= Mystery Challenge ===============` |
| Achievement Engine | Tracks stats per mode, checks unlock conditions, triggers confetti/notifications, writes to Supabase/localStorage. | `// ================= ACHIEVEMENTS ====================` |
| Supabase Sync | Optional save/load for XP, achievements, collections. Gracefully no-ops when offline or unauthenticated. | `// Save game progress to Supabase database` |
| Event Cleanup | Timer, marker, and fetch controller cleanup on mode switch. Added Oct 2025. | `stopAllGameTimers(); cleanupGameMarkers();` |

---

## 🧩 Feature Modules

### Location Explorer Sidebar (Explore Mode)
- 8-card stack covering header, quick facts, comparison/distance, AI facts, verified photos, weather, nearby places, and future challenges.
- Reverse geocoding via Nominatim with 1-second throttling and AbortController cancellation.
- Photo facts matched through `match-photos-to-facts` Netlify function → Vision AI verifies alignment.
- Achievements tie-ins for markers placed, countries visited, distinct continents explored.
- Documentation: `LOCATION_EXPLORER_SIDEBAR_PLAN.md`, `PHASE_3_COMPLETE.md`, `PHOTO_FACT_MATCHING.md`, `PHOTO_MODAL_COMPLETE.md`, `ENHANCED_PHOTO_SYSTEM_COMPLETE.md`.

### Game Modes Summary

| Mode | Purpose | Status | Notes |
| --- | --- | --- | --- |
| Explore | Free map interaction, learning UI | ✅ Stable | Location Explorer + achievements live |
| Mystery Challenge | Guess coordinates from hints | ✅ Stable | Timer cleanup fixed Oct 2025; pause/resume backlog |
| Scavenger Hunt | Find POIs from list | ✅ Stable | Variety expansion planned (see `ACTION_PLAN.md`) |
| Guess the Location | Multiple-choice satellite quiz | ✅ Stable | Content refresh planned |
| Missions | Structured tasks progression | ⚠️ Needs UX polish | Completion celebration backlog |
| Create a Heist | Students design custom challenges | ⚠️ Needs input sanitization | Hard limits & share loop planned |
| Alaska Adventure | Regional mastery mode | ✅ Stable | Achievement tracking verified Oct 2025 |
| Ocean Explorer | Optional deep-dive spin-off | ✅ Maintained | Uses dedicated HTML + data files |

### Achievement & XP Engine
- 45 achievements with rarity tiers; triggers confetti overlay and toast messaging.
- Stats tracked per mode (`playerAchievements.stats`).
- Auto-save to localStorage; optional Supabase persistence via `game_progress` table.
- Latest changes: Explore achievements incremented on `showLocationInfo` and `populateLocationData`; multiple redundant checks removed.
- Docs: `ACHIEVEMENT_UNLOCKS_COMPLETE.md`, `ACHIEVEMENT_TESTING.md`, `GEN_ALPHA_ACHIEVEMENTS.md`.

### Nuclear Safety System
- Prompt guard + post-generation filter lives inside AI fetch wrappers.
- `NUCLEAR_SAFETY_SYSTEM.md` documents forbidden keyword list and override logic.
- `NUCLEAR_SAFETY_TESTS.md` provides regression scenarios; October QA run in `test_results.md` backlog.
- Vision AI photo validation integrated to prevent mismatched images.

---

## ☁️ Data & Persistence

| Layer | Details |
| --- | --- |
| LocalStorage | `geoDetectiveState` stores XP, mode stats, heists. Autosave triggered on state change. Quota guard still outstanding (see `BUGS_DETAILED.md`). |
| Supabase Tables | `accounts`, `game_progress`, `ocean_species_discoveries`. Schemas in `/sql/*.sql`. RLS policies ensure teacher/student scoping. |
| Netlify Functions | Located in `/netlify/functions/`. Provide access to Claude/GPT, Unsplash, Pexels, OpenWeather, Overpass, and Vision AI.
| Environment Variables | `.env.example` lists required keys. Use `netlify dev` or `local-dev-server.js` proxy for local testing with functions. |

### Active Netlify Functions

| Function | Purpose | Notes |
| --- | --- | --- |
| `get-ai-facts.js` | Claude 3.5 fact generation with GPT-4o-mini fallback. Applies nuclear filter. |
| `match-photos-to-facts.js` | Creates fact-specific photo prompts, validates with Vision AI. |
| `get-photos.js` | General photo retrieval with safe search. |
| `get-weather.js` | Current conditions via OpenWeather. |
| `generate-real-life-geography.js` | AI-generated real-world applications. |
| `get-species-photos.js` / `get-species-ai-facts.js` | Ocean Explorer-specific helpers. |

Documentation: `NETLIFY_FUNCTIONS_REFERENCE.md`, `NETLIFY_FUNCTIONS_SETUP.md`, `AI_INTEGRATION_PLAN.md`.

---

## 🧪 Testing & Quality

### Regression Checklist (Oct 2025)

1. **Explore Mode**
   - Click 5 random locations → verify cards populate; check throttling prevents API spam.
   - Confirm `cleanupGameMarkers()` leaves only active markers after mode switches.
   - Validate Vision AI logs success/fail in console when photos requested.
2. **Mystery Challenge**
   - Start game → switch to Scavenger → confirm timer cleared.
   - Resume Mystery → ensure streak and progress correct after mode swap.
3. **Achievements**
   - Trigger `Explorer` achievements via Explore markers.
   - Unlock one Alaska badge; ensure toast appears once.
   - Refresh page; verify achievements persist (localStorage + optional Supabase).
4. **Safety**
   - Force banned keyword; ensure rejection message displayed.
   - Run `NUCLEAR_SAFETY_TESTS.md` prompts for Colorado/Amsterdam/Las Vegas cases.
5. **Create a Heist**
   - Enter >200 char clue; observe TODO for sanitization (see bug backlog).

Record results in `test_results.md`; update `TESTING_GUIDE.md` if procedures change.

### Known Open Items (see `BUGS_DETAILED.md` for full context)
- Input sanitization & length limits for Create-a-Heist fields.
- LocalStorage quota guard + pruning for large heist collections.
- Mystery Challenge pause/resume button (requested by students).
- Additional dataset variety for Scavenger/Guess games.

---

## 📦 Supporting Documentation Map

| Topic | Files |
| --- | --- |
| UX & Culture | `GEN_ALPHA_CULTURE_RESEARCH.md`, `GAME_POLISH_PLAN.md`, `GAME_IMPROVEMENT_ROADMAP.md` |
| Deployment & Ops | `DEPLOYMENT_GUIDE.md`, `NETLIFY_DEPLOYMENT_CHECKLIST.md`, `SAFE_DEPLOYMENT_STRATEGY.md`, `PRODUCTION_SAFETY_QUICK_REFERENCE.md` |
| SaaS Planning | `SAAS_TRANSFORMATION_ROADMAP.md`, `SAAS_AUTH_ARCHITECTURE.md`, `SAAS_IMPLEMENTATION_WEEK_BY_WEEK.md`, `STUDENT_AUTH_PLAN.md` |
| Compliance | `FERPA_COMPLIANCE_GUIDE.md`, `FERPA_QUICK_START.md`, `SECURITY_AND_ENV_DOCUMENTATION.md` |
| Ocean Explorer | `OCEAN_EXPLORER_RESEARCH.md`, `OCEAN_EXPLORER_UX_FIXES.md`, `LINEAR_DISCOVERY_COMPLETE.md`, `OCEAN_ASSETS_PLAN.md` |

---

## 🔄 Maintenance Protocol

1. When modifying a major subsystem (Location Explorer, achievements, safety, AI pipelines, game modes), update this index and note the change in `DOCUMENTATION_UPDATE_SUMMARY.md`.
2. Keep `index.html` anchor comments accurate; they are referenced throughout this index.
3. Archive superseded documentation in the `/handoff-docs/` folder or append a **Deprecated** banner rather than deleting.
4. Rerun the documentation cross-reference checklist in `DOCUMENTATION_CROSS_REFERENCE_MAP.md` before shipping large doc edits.

---

Questions or corrections? Ping GitHub Copilot in `00_START_HERE_FIRST.md` before touching core files. Keeping this index accurate is part of the release checklist.

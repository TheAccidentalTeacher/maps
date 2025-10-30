# Geographic Detective Academy & Math City Builder

**Version:** 3.0  
**Last Updated:** October 29, 2025  
**Projects Covered:** Geography Detective Academy (web app) & Math City Builder (canvas game)

This repository now serves two tightly related classroom experiences. The geography web app is live with students in Alaska, while the Math City Builder is a rapidly maturing canvas-based city-planning game that teaches math through building. This README is the front door for both initiatives.

> **First-time here?** Open `00_START_HERE_FIRST.md`. That file explains the workspace layout and sends you to the right project-specific index.

---

## Quick Navigation

- `00_START_HERE_FIRST.md` – Mandatory entry point for AI assistants and new contributors.
- `DOCUMENTATION_INDEX.md` – Living table of contents for the entire repository.
- `MASTER_DOCUMENTATION_INDEX.md` – Deep index for the Geography Detective Academy web app.
- `WORKSPACE_MASTER_INDEX.md` – Cross-project map, including Math City Builder docs.
- `MATH_CITY_BUILDER_ACTUAL_STATUS.md` – Current technical status of the canvas game.

Need an at-a-glance view by role? Jump to **[Documentation Index](./DOCUMENTATION_INDEX.md)** and follow the persona-based guides.

---

## Project Overview

### Geography Detective Academy (Web App)

- **Status:** Classroom-ready; actively used by 15 middle school students (ages 11–14).
- **Core Tech:** HTML5, CSS3, vanilla JS, Leaflet 1.9.4, Netlify Functions (Node.js), Claude 3.5 Sonnet & GPT-4o-mini for AI features.
- **Key Features:**
	- Explore Mode with eight-card Location Explorer sidebar (facts, weather, nearby POIs, AI insights, verified photos).
	- Seven fully playable game modes (Explore, Mystery Challenge, Scavenger Hunt, Guess the Location, Missions, Create a Heist, Alaska Adventure).
	- Nuclear Safety System with layered prompt filtering, post-generation validation, and Vision AI photo checks.
	- Achievement + XP progression (45 achievements) with cleanup for timers, markers, and race conditions completed in October 2025.
	- Supabase integration scaffolded; localStorage remains the primary persistence for students while SaaS features are staged.
- **Where to go next:** `MASTER_DOCUMENTATION_INDEX.md` → `CODE_ARCHITECTURE.md` → `CODE_REVIEW_SUMMARY.md` for deep technical context.

### Math City Builder (Canvas Game)

- **Status:** ~70% feature-complete; roads aligned, tiered building catalog wired, math quiz economy functional; awaiting sprite-layering polish.
- **Core Tech:** HTML5 Canvas, vanilla JS modules (`grid.js`, `canvas.js`, `game.js`, `quiz.js`), Kenney City Builder assets.
- **Recent Highlights:**
	- Grid scaled to 128×64 isometric diamonds; screen/grid transforms audited.
	- Roads rescaled and depth-sorted beneath buildings; offsets tuned to eliminate gaps.
	- Base cash increased to $500,000 for rapid testing; economy tiers (1–5) and decoration catalog curated.
	- Building manifest updated with roof-base composite mapping to enable layered rendering work.
- **Where to go next:** Read `MATH_CITY_BUILDER_ACTUAL_STATUS.md` then `MATH_CITY_BUILDER_MASTER_PLAN.md`. Sonnet 4.5’s execution handoff lives in `math-city-builder/ROADMAP_LAYERED_BUILDINGS.md` (new planning doc referenced below).

---

## Development Setup

### Geography Detective Academy

- **Prerequisites:** Node 18+ (for Netlify functions), Python 3 (for quick static hosting), modern browser (Chromium/Safari/Firefox).
- **Local server (static):**
	```powershell
	cd C:\Users\scoso\WEBSITES\Mrsomersmaps
	python -m http.server 8000
	```
- **Local server (API-ready):**
	```powershell
	node local-dev-server.js
	```
- **URLs:**
	- App root: `http://localhost:8000/index.html`
	- Debug utilities: `debug-location-explorer.html`, `clear-cache.html`
- **Environment:** Copy `.env.example` → `.env.local`, populate Supabase + API keys per `NETLIFY_FUNCTIONS_SETUP.md`.

### Math City Builder

- **Prerequisites:** Same as above (vanilla stack).
- **Run it:**
	```powershell
	cd C:\Users\scoso\WEBSITES\Mrsomersmaps
	python -m http.server 8000
	# open http://localhost:8000/math-city-builder/index.html
	```
- **Key entry files:**
	- `math-city-builder/js/game.js` – state, economy, achievements.
	- `math-city-builder/js/canvas.js` – rendering, depth sorting, grid conversions.
	- `math-city-builder/js/buildings.js` – manifest of 50 buildings + decorations.
	- `math-city-builder/js/quiz.js` & `mathTypes.js` – question bank + modal logic.

---

## Documentation Map

| If you need… | Go here |
| --- | --- |
| Workspace orientation | `00_START_HERE_FIRST.md` |
| Persona-based jumps (teacher/dev/student/manager) | `DOCUMENTATION_INDEX.md` |
| Geography Detective deep docs | `MASTER_DOCUMENTATION_INDEX.md` |
| Math City Builder navigation | `WORKSPACE_MASTER_INDEX.md` → Math section |
| Detailed math builder status | `MATH_CITY_BUILDER_ACTUAL_STATUS.md` |
| Current action plan | `ACTION_PLAN.md` |
| Bug triage history | `BUGS_DETAILED.md` & `CRITICAL_BUGS_FIXED.md` |
| Supabase / SaaS notes | `SUPABASE_QUICK_REFERENCE.md`, `SAAS_TRANSFORMATION_ROADMAP.md` |

Every index and status doc was refreshed on October 29, 2025. If you spot drift, run the documentation checklist in `DOCUMENTATION_CROSS_REFERENCE_MAP.md` before editing.

---

## Recent Highlights (October 2025)

- **Geography Detective:**
	- Timer, marker, and fetch controller cleanup complete; “ghost timers” and race conditions eliminated.
	- Explore mode achievements wired into the new location fetch throttling logic.
	- Supabase client consolidation; local save still supported for offline classrooms.
- **Math City Builder:**
	- Road sprites scaled to 128 px width and depth-sorted under structures; y-offset tuned.
	- Building manifest normalized to reference roof/base composites; groundwork laid for layered roofs.
	- Starting funds bumped to $500k for sandbox testing; UI updated to reflect large balances.
- **Documentation:**
	- Top-level indexes rewritten for clarity (this README, `DOCUMENTATION_INDEX.md`, `00_START_HERE_FIRST.md`).
	- Executive and action summaries synchronized with current codebase metrics.
	- New Sonnet 4.5 execution plan generated for building layering (see new roadmap file referenced below).

---

## What’s Next

1. **Finalize layered building rendering in Math City Builder.** Plan documented in `math-city-builder/BUILDING_LAYER_EXECUTION_PLAN.md` (added in this update).
2. **Harden Geography Detective input validations** (Create-a-Heist sanitization, storage quota checks) per `BUGS_DETAILED.md` open items.
3. **Align README & indexes after every feature sprint.** When a feature lands, update the relevant persona path in `DOCUMENTATION_INDEX.md` and log the change in `DOCUMENTATION_UPDATE_SUMMARY.md`.

---

## Contribution Guidelines

- Follow the navigation flow in `00_START_HERE_FIRST.md` before editing either project.
- Keep code comments focused and informative (avoid redundant narration).
- Prefer updating existing docs instead of spawning duplicates; if you create new material, add it to `DOCUMENTATION_INDEX.md`.
- Cache-bust documentation by updating the “Last Updated” field with ISO-ish timestamps (month and day) when you touch a file.

---

## Support & Contact

- **Technical issues:** Review `BUGS_DETAILED.md` and `QUICK_FIXES.md` before escalating.
- **Teacher onboarding:** See `USER_INSTRUCTIONS.md`, `DASHBOARD_QUICK_REFERENCE.md`.
- **Deployments:** Start with `DEPLOYMENT_GUIDE.md` and `NETLIFY_DEPLOYMENT_CHECKLIST.md`.
- **Repository:** [github.com/TheAccidentalTeacher/maps](https://github.com/TheAccidentalTeacher/maps)

---

## License & Credits

Educational use only for now; formal licensing will be defined prior to SaaS launch. Built by TheAccidentalTeacher with support from GitHub Copilot and Claude Sonnet for AI-assisted workflows. Asset packs courtesy of Kenney.nl (see `CITY_ASSETS_INVENTORY.md`).

---

If you improve functionality or docs, update this README’s highlights section and the master indexes. Keeping the documentation truthful is just as important as shipping the feature.
# 🏙️ Math City Builder – Layered Building Execution Plan

**Version:** 1.0  
**Last Updated:** October 29, 2025  
**Primary Owner:** Sonnet 4.5 (Math City Builder strike team)

This roadmap turns the “finish layered buildings” directive into concrete, testable iterations. It assumes the current 2D canvas build documented in `MATH_CITY_BUILDER_ACTUAL_STATUS.md` and focuses on shipping a polished, sprite-driven experience that is ready for classroom pilots.

---

## 🎯 Goals & Non-Negotiables

- Deliver working layered sprites (base + roof + decorations) across all five building tiers and freeform roads/landscape tiles.  
- Keep the existing game loop (math quiz → cash → placement) intact; we refine visuals and progression without breaking core play.  
- Ship to students only after Supabase save/sync, milestone economy, and regression testing are green.  
- Every iteration lands in `main` behind documentation updates (`DOCUMENTATION_UPDATE_SUMMARY.md`, `MATH_CITY_BUILDER_ACTUAL_STATUS.md`).

---

## 📦 Current Baseline (Audit @ Oct 29)

| Area | Status | Notes |
| --- | --- | --- |
| **Rendering** | Placeholder diamonds render; sprite loader expects PNG per `BUILDINGS_DATA` entries. | Roads/landscape use dedicated folders; building composites defined but not yet composed. |
| **Game Loop** | ✅ Dollars, XP, milestones, demolish toggle, zoom/pan. | Needs UI feedback polish when funds missing. |
| **Quiz Modal** | Partially verified. | Manual QA required to confirm payouts + streak logic. |
| **Persistence** | LocalStorage auto-save only. | Supabase schema exists (`city_progress`); integration pending. |
| **Assets** | GLB library + some PNG tiles. | Need reliable PNG pipeline or temporary emoji fallback. |

---

## 🛠 Guiding Principles

- **Layer everything deterministically.** Sort by grid depth first, then tier; roads/ground always render before buildings, roofs after bases.  
- **Fail loud.** Any missing sprite logs with building id/tier and falls back to emoji so QA never silently regresses.  
- **Feature flags for risky swaps.** Keep `USE_EMOJI_FALLBACK`/`ENABLE_SUPABASE_SYNC` toggles so we can stage releases.  
- **Documentation or it didn’t happen.** Update the quick reference, status, and this plan after each iteration.

---

## 🚦 Iteration Roadmap

### Iteration 0 – Codebase Audit & Instrumentation (0.5 day)
- [ ] Add debug overlay toggle showing render order, active sprite path, and frame draw time in `canvas.js`.  
- [ ] Expose `window.mcbDebug` helpers (e.g., `dumpPlacedBuildings()`, `forceEmojiMode()`).  
- [ ] Verify quiz modal path (`showQuizModal`) end-to-end; file observations in `MATH_CITY_BUILDER_ACTUAL_STATUS.md` before new work.  
**Acceptance:** Checklist captured in `test_results.md`; no gameplay regressions.

### Iteration 1 – Visual Layer Foundation (1 day)
- [ ] Implement `USE_EMOJI_FALLBACK` constant + ghost preview that honors fallback.  
- [ ] Finish composite rendering: when `BUILDING_COMPOSITES` maps a roof, render base first, then roof sprite offset correctly.  
- [ ] Normalize sprite positioning (roads scaled to 128×83, buildings centered) and add per-tier offset map for tall sprites.  
- [ ] Add collision highlight + snackbar messaging when placement fails due to funds/overlap.  
**Acceptance:** 10 sample buildings + 4 road tiles render with emoji fallback disabled and zero z-fighting.

### Iteration 2 – Asset Pipeline & Texture Import (2 days)
- [ ] Batch convert Kenney GLB → orthographic PNG (256×256 transparent) using Blender script stored in `tools/blender_export.py`.  
- [ ] Document conversion flow in `CITY_ASSETS_INVENTORY.md` (inputs, script usage, naming convention).  
- [ ] Integrate new PNGs into `/assets/math-city-builder/buildings/tierX/`; update `BUILDINGS_DATA` paths if naming shifts.  
- [ ] Add automated asset smoke test (`npm run sprite-check`) that loads every sprite and outputs failures.  
**Acceptance:** `npm run sprite-check` passes; in-game grid shows base+roof PNGs for each tier without emoji fallback.

### Iteration 3 – Gameplay Integration & Feedback (1.5 days)
- [ ] Wire quiz payouts to display money/XP confetti and building unlock notifications.  
- [ ] Add HUD indicators for next tier unlock thresholds and milestone bonuses.  
- [ ] Implement optional building info tooltip (cost, upkeep, math bonus).  
- [ ] Ensure demolish mode animates removal and refunds with toast.  
**Acceptance:** QA script exercises quiz → purchase → demolish flow with clear player feedback.

### Iteration 4 – Supabase Sync & Multi-Device Support (1 day)
- [ ] Port auth/session helpers from `math-city-builder.html`; use service role only on Netlify Functions.  
- [ ] Create `city_progress` upsert functions (save: placed buildings array, dollars, xp; load: merges with local state).  
- [ ] Add offline guardrails: if Supabase unavailable, fall back to localStorage with banner.  
- [ ] Update `SECURITY_AND_ENV_DOCUMENTATION.md` with new env vars and RLS expectations.  
**Acceptance:** Two browsers (student + teacher) load same account and share progress via Supabase; offline mode banner appears when network down.

### Iteration 5 – Polish, QA, and Classroom Launch (1 day)
- [ ] Integrate subtle placement animations + audio cues (use CC0 click/coin sounds).  
- [ ] Run full regression (`test_results.md` template): placement, quiz, milestones, Supabase sync, emoji fallback flag.  
- [ ] Create classroom rollout guide with 10-minute teaching script + troubleshooting.  
- [ ] Record loom/video walkthrough for stakeholders.  
**Acceptance:** `DOCUMENTATION_UPDATE_SUMMARY.md` captures release; green regression log attached; leadership sign-off in `ACTION_PLAN.md`.

---

## 🧪 Testing Matrix

| Scenario | Owner | Tools |
| --- | --- | --- |
| Sprite coverage smoke test | Sonnet 4.5 | `npm run sprite-check`, console logs. |
| Placement regression (roads + tier combos) | Human QA | Manual grid script in `test_results.md`. |
| Quiz payout correctness | Automated TBD | Add Jest-style unit tests around `quiz.js`. |
| Supabase sync | Sonnet 4.5 + teacher pilot | Two-device scenario; Supabase dashboard. |
| Performance sanity (60 FPS at 200 buildings) | Perf harness | `window.mcbDebug.profileRender()` draws 500 frames. |

---

## ⚠️ Risks & Mitigations

- **Sprite mismatch / missing assets.** Mitigate with export script logs and the fallback emoji path; block merge if smoke test fails.  
- **Supabase rate limits or offline classrooms.** Cache quizzes locally; throttle cloud writes; maintain offline-first flow.  
- **Scope creep (Construct 3 / 3D nostalgia).** Lock plan to 2D canvas until after classroom launch; any 3D revisit becomes separate RFC.  
- **QA bottleneck.** Schedule 30-minute QA after each iteration; document in `TESTING_GUIDE.md` so helpers can replicate.

---

## 🔄 Coordination & Follow-Through

- Update `MATH_CITY_BUILDER_ACTUAL_STATUS.md` after each iteration with % complete and notable deltas.  
- Log documentation changes in `DOCUMENTATION_UPDATE_SUMMARY.md` and cross-reference in `DOCUMENTATION_CROSS_REFERENCE_MAP.md`.  
- When Iteration 5 completes, archive this plan (v1.0) and spin v2.0 for post-launch enhancements (missions, Math Museum quests).

---

Ready to build? Kick off Iteration 0 by running the audit checklist and jotting results in `test_results.md`, then ping GitHub Copilot for the next task card.

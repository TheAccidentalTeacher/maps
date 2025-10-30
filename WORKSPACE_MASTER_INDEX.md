# 📚 WORKSPACE MASTER INDEX - ALL PROJECTS

**Workspace:** Geography Detective Academy + Math City Builder  
**Last Updated:** October 25, 2025  
**For:** AI Assistants, Developers, Future Reference

---

## 🚨 CRITICAL: READ THIS FIRST

**This workspace contains TWO separate projects:**

1. **Geography Detective Academy** (Primary) - Working web app
2. **Math City Builder** (Secondary) - 3D game in development (engine evaluation phase)

**ALWAYS ask which project the user is referring to before making changes!**

---

## 🎮 MATH CITY BUILDER (2D Canvas Game Project)

### 📊 Project Status: 60% COMPLETE ✅

**🚨 CRITICAL UPDATE (Oct 27, 2025):** We have a working 2D Canvas game built Oct 26!

**Current Implementation:** Vanilla JavaScript + Canvas API (2D sprites)  
**Previous Attempts:** Three.js (failed), Construct 3 (failed), GDevelop (never used)  
**Budget Lost:** $168 (Construct 3 refund requested)  
**Working Code:** `math-city-builder/` folder (last modified Oct 26, 9:37 PM)

---

### 🚨 MANDATORY READING FOR AI ASSISTANTS

**Before working on Math City Builder, read these IN ORDER:**

1. 👉 **[00_START_HERE_MATH_CITY_BUILDER.md](./00_START_HERE_MATH_CITY_BUILDER.md)** ⭐ **START HERE!**
   - Overview and quick start guide
   - What actually exists
   - Links to all other required docs
   
2. 👉 **[MATH_CITY_BUILDER_ACTUAL_STATUS.md](./MATH_CITY_BUILDER_ACTUAL_STATUS.md)** ⭐ **REQUIRED!**
   - Complete technical status
   - Working vs. broken features
   - How to finish the last 40%
   
3. 👉 **[MATH_CITY_BUILDER_QUICK_REFERENCE.md](./MATH_CITY_BUILDER_QUICK_REFERENCE.md)**
   - One-page cheat sheet
   - Quick start commands
   - Common mistakes to avoid

**DO NOT skip these! They explain why old docs (GDevelop tracker) are wrong.**

---

### 🗺️ Navigation Map

**Current Status Documentation:**
👉 **[00_START_HERE_MATH_CITY_BUILDER.md](./00_START_HERE_MATH_CITY_BUILDER.md)** ⭐ **PRIMARY ENTRY POINT**
- Complete overview and navigation
- Points to all required reading
- Quick start guide

👉 **[MATH_CITY_BUILDER_ACTUAL_STATUS.md](./MATH_CITY_BUILDER_ACTUAL_STATUS.md)** ⭐ **TECHNICAL DETAILS**
- What actually exists (two implementations!)
- Current working version (60% complete)
- What's done vs. what's not done
- Why we got confused (timeline of events)
- How to finish the last 40%

👉 **[MATH_CITY_BUILDER_QUICK_REFERENCE.md](./MATH_CITY_BUILDER_QUICK_REFERENCE.md)** 📋 **QUICK REF**
- One-page reference card
- Quick start commands
- Completion checklist

**Engine Evaluation History:**
👉 **[GAME_ENGINE_EVALUATION_SUMMARY.md](./GAME_ENGINE_EVALUATION_SUMMARY.md)**
- Complete history of all engine attempts
- Why Three.js failed (20+ hours, images wouldn't render)
- Why Construct 3 failed ($168, cannot import GLB models)
- Why we abandoned GDevelop (built custom solution instead)

**OUTDATED Documentation (DO NOT USE):**
👉 **[GDEVELOP_PROGRESS_TRACKER.md](./GDEVELOP_PROGRESS_TRACKER.md)** ⚠️ **IGNORE THIS - WRONG!**
- We never actually used GDevelop!
- Account created but no implementation
- Built custom Canvas game instead on Oct 26
- **Kept for historical reference only**

**Archived Construct 3 Work:**
👉 **[CONSTRUCT3_PROGRESS_TRACKER.md](./CONSTRUCT3_PROGRESS_TRACKER.md)** 📦 ARCHIVED
- Phases 1-3 completed (project setup, 3D test, background)
- Phase 4 blocked (3DObject addon deprecated)
- ⚠️ Status: Project discontinued, refund requested

👉 **[CONSTRUCT3_ADVANCED_FEATURES.md](./CONSTRUCT3_ADVANCED_FEATURES.md)** 📦 ARCHIVED
- 1,968 lines of research on 3D features, isometric techniques, addons
- ⚠️ 3D Model Import NOT possible (dealbreaker documented)
- ✅ Still useful for: 2D games, Z-elevation with sprites, isometric games

👉 **[CONSTRUCT3_REFUND_REQUEST.md](./CONSTRUCT3_REFUND_REQUEST.md)** 📄 ACTIVE
- Professional refund letter to Scirra Ltd
- Documents dealbreaker issue (3DObject addon deprecated)
- Status: Pending (submitted October 25, 2025)

**Universal Assets:**
👉 **[CITY_ASSETS_INVENTORY.md](./CITY_ASSETS_INVENTORY.md)** 📦 READY
- 200+ Kenney GLB 3D building models cataloged
- Organized by category (commercial, industrial, suburban, roads)
- ✅ Valid for any game engine that supports GLB

**Database Schema:**
👉 **[SQL/create-city-progress-table.sql](./SQL/create-city-progress-table.sql)** 🗄️ READY
- Supabase database schema for save/load
- Engine-agnostic (works with any frontend)

**Failed Attempts (Archived):**
👉 **[math-city-builder.html](./math-city-builder.html)** 📦 ARCHIVED
- Three.js implementation (920+ lines)
- Status: Non-functional (images never rendered after 20+ hours)
- Contains: Supabase integration, debug system (salvageable pieces)

---

## 🌍 GEOGRAPHY DETECTIVE ACADEMY (Web App)

### 📊 Project Status: PRODUCTION (15 Active Students)

**Tech Stack:** Vanilla JS, Leaflet.js, HTML5, CSS3, localStorage  
**Architecture:** Single-file (index.html - 2,398 lines)  
**Users:** Middle school students (ages 11-14) in Alaska

### 🗺️ Navigation - Use Existing Index

👉 **[MASTER_DOCUMENTATION_INDEX.md](./MASTER_DOCUMENTATION_INDEX.md)** 📚 GEOGRAPHY INDEX
- Complete navigation for Geography Detective project
- All feature documentation
- Code architecture
- Deployment guides

👉 **[00_START_HERE_FIRST.md](./00_START_HERE_FIRST.md)** 📍 QUICK START
- Updated with both project sections
- Quick decision guide
- Documentation structure

👉 **[README.md](./README.md)** 🏠 HOME
- Main project overview
- Getting started guides

---

## 🎯 QUICK DECISION GUIDE FOR AI ASSISTANTS

### Which Index Should I Use?

| User Asks About... | Use This Index |
|-------------------|----------------|
| Math City Builder, 3D game, GLB models, game engines | THIS FILE (WORKSPACE_MASTER_INDEX.md) |
| Geography Detective, map game, coordinate finder | MASTER_DOCUMENTATION_INDEX.md |
| "I don't know which project" | Ask user to clarify! |

### Math City Builder Quick Reference:

| User Says... | Go To... |
|-------------|----------|
| "What game engines did we try?" | GAME_ENGINE_EVALUATION_SUMMARY.md |
| "Why didn't Three.js work?" | GAME_ENGINE_EVALUATION_SUMMARY.md (20+ hours, rendering failed) |
| "Why didn't Construct 3 work?" | GAME_ENGINE_EVALUATION_SUMMARY.md (GLB import impossible) |
| "Can we use Construct 3 for anything?" | Yes! See CONSTRUCT3_ADVANCED_FEATURES.md (2D games) |
| "Should I try Three.js?" | NO! Already failed. See GAME_ENGINE_EVALUATION_SUMMARY.md |
| "What are the Kenney assets?" | CITY_ASSETS_INVENTORY.md (200+ GLB models) |
| "Where are we with GDevelop?" | GDEVELOP_PROGRESS_TRACKER.md |
| "What's the refund status?" | CONSTRUCT3_REFUND_REQUEST.md (pending) |

### Geography Detective Quick Reference:

**Use:** [MASTER_DOCUMENTATION_INDEX.md](./MASTER_DOCUMENTATION_INDEX.md) for complete navigation

---

## 📂 FILE ORGANIZATION

### Math City Builder Files:
```
📁 Active Development:
  ⭐ GAME_ENGINE_EVALUATION_SUMMARY.md (master reference)
  ⏳ GDEVELOP_PROGRESS_TRACKER.md (current work)
  📦 CITY_ASSETS_INVENTORY.md (asset library)
  🗄️ SQL/create-city-progress-table.sql (database)

📁 Archived (Reference Only):
  📦 CONSTRUCT3_ADVANCED_FEATURES.md (useful for 2D)
  📦 CONSTRUCT3_PROGRESS_TRACKER.md (failed attempt)
  📄 CONSTRUCT3_REFUND_REQUEST.md (refund letter)
  📦 math-city-builder.html (Three.js failed attempt)
```

### Geography Detective Files:
**See:** [MASTER_DOCUMENTATION_INDEX.md](./MASTER_DOCUMENTATION_INDEX.md) for complete file tree

---

## ⚠️ CRITICAL WARNINGS FOR AI ASSISTANTS

### Math City Builder:

**DO NOT Recommend:**
1. ❌ Three.js without expert developer (already failed 20+ hours)
2. ❌ Construct 3 for GLB import (3DObject addon deprecated)
3. ❌ Any solution without 30-minute verification test first
4. ❌ Multi-hour investments without proof-of-concept

**DO Recommend:**
1. ✅ GDevelop as first choice (free, native GLB, Kenney.nl recommended)
2. ✅ 30-minute verification protocol (test ONE model first)
3. ✅ PlayCanvas as backup if GDevelop fails
4. ✅ Professional developer hire if both fail ($200-500)

**Time-Boxing Rule:**
- If verification doesn't show GLB rendering in 30 min → PIVOT immediately
- User has lost 24+ hours (20 Three.js, 4+ Construct 3)
- User has $168 at risk (Construct 3 refund pending)
- No more failed experiments

### Geography Detective Academy:

**See:** [MASTER_DOCUMENTATION_INDEX.md](./MASTER_DOCUMENTATION_INDEX.md) for development guidelines

---

## 📊 PROJECT METRICS

### Math City Builder:
- **Time Invested:** 26+ hours (20 Three.js, 4+ Construct 3, 2+ documentation)
- **Money Spent:** $168 (refund pending)
- **Assets Ready:** 200+ Kenney GLB models
- **Code Written:** 920 lines (Three.js, non-functional)
- **Current Phase:** Testing (GDevelop verification)

### Geography Detective:
- **Code Size:** 2,398 lines (index.html)
- **Documentation:** 250+ KB across 35+ files
- **Active Users:** 15 students in Alaska
- **Game Modes:** 7 (all functional)
- **Completion:** ~70%
- **Status:** Production (working app)

---

## 🎓 LESSONS LEARNED (FOR FUTURE AI REFERENCE)

1. **Verify Core Features First** - Test dealbreakers in first 30 minutes
2. **Free Before Paid** - Use free trials/tiers for proof-of-concept
3. **Check Current Status** - Old tutorials may reference deprecated features
4. **Test With Real Assets** - Don't assume, verify with actual project files
5. **Time-Box Experiments** - Set 30-min limits, pivot if blocked
6. **Document Everything** - Future AI assistants need full context
7. **Ask Before Assuming** - Clarify which project user is discussing

---

## 📍 WHICH FILE TO READ FIRST?

**If user mentions...**

### Math City Builder Keywords:
- "3D game", "math game", "city builder"
- "GLB", "3D models", "Kenney assets"
- "Three.js", "Construct 3", "GDevelop"
- "game engine", "which engine"
- "$168", "refund"

**→ YOU ARE IN THE RIGHT FILE! Read [GAME_ENGINE_EVALUATION_SUMMARY.md](./GAME_ENGINE_EVALUATION_SUMMARY.md) next**

### Geography Detective Keywords:
- "map game", "geography", "coordinates"
- "Leaflet", "localStorage", "index.html"
- "students in Alaska", "middle school"
- "game modes", "mystery challenge"
- "coordinate finder", "six seven"

**→ Go to [MASTER_DOCUMENTATION_INDEX.md](./MASTER_DOCUMENTATION_INDEX.md) instead**

### Unclear/Both:
- "the game", "the app", "the project"
- "fix the code", "add feature"
- "what should I do"

**→ ASK USER TO CLARIFY which project they mean!**

---

## 🔄 UPDATE PROTOCOL

**When to Update This File:**
1. New Math City Builder engine evaluation completed
2. GDevelop verification test results recorded
3. Construct 3 refund status changes
4. New game engine attempt begins
5. Math City Builder phase milestones reached

**Files That Should Trigger This Index Update:**
- New game engine documentation created
- GDEVELOP_PROGRESS_TRACKER.md phase completions
- GAME_ENGINE_EVALUATION_SUMMARY.md updates
- Budget/cost changes in Math City Builder
- Project status changes (testing → implementation)

---

**Last Updated:** October 25, 2025, 6:30 PM  
**Next Review:** When GDevelop Phase 1 verification completes  
**Maintained By:** AI assistants helping with this workspace

# AI Sci-Fi Command Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the FactoryCool dashboard feel like an intelligent sci-fi command cockpit centered on AI autonomous cooling control.

**Architecture:** Keep the existing single-screen React dashboard and enhance its presentational layers. Add semantic class tokens for AI cognition, digital twin targeting, and analytics prediction so tests can lock the visual contract without coupling to CSS internals.

**Tech Stack:** React 18, Vite, CSS animations, Node test runner.

---

### Task 1: Lock Visual Contract With Failing Tests

**Files:**
- Modify: `frontend/src/test/rendering.test.js`

- [ ] Add tests that assert the dashboard source and stylesheet include new AI command cockpit tokens: `ai-command-matrix`, `cognition-stream`, `autonomy-gauge`, `thermal-target-lock`, `cooling-command-vector`, `predictive-horizon`, `intelligence-ribbon`, `forecast-ghost-line`.
- [ ] Run `npm --prefix frontend test`.
- [ ] Expected result before implementation: FAIL because the new tokens do not exist yet.

### Task 2: Add Intelligent Visual Layers

**Files:**
- Modify: `frontend/src/components/CodeDashboard.jsx`
- Modify: `frontend/src/styles/dashboard.css`

- [ ] Add top-level command ambience layers behind readable content.
- [ ] Add AI core cognition streams, autonomy gauge, and decision telemetry.
- [ ] Add digital twin thermal lock and cooling command vectors.
- [ ] Add analytics prediction overlays and forecast ghost line.
- [ ] Keep text readable and all effects behind content layers.

### Task 3: Verify

**Files:**
- Verify: `frontend/src/test/rendering.test.js`
- Verify: `frontend/src/styles/dashboard.css`

- [ ] Run `npm --prefix frontend test`.
- [ ] Run `npm --prefix frontend run build`.
- [ ] Check `git diff --stat` and confirm only scoped files changed, plus the existing Vite host change remains untouched.

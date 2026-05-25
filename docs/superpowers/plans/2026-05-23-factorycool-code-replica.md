# FactoryCool Pure-Code Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a high-fidelity pure-code replica of the FactoryCool dashboard screenshot in the existing React frontend.

**Architecture:** Keep `CodeDashboard.jsx` as the single dashboard view and implement the missing visual system in `dashboard.css`. Use tests to enforce the no-image contract and the presence of the code-rendered stage, panels, factory, AI center, analytics, KPI strip, and ticker selectors.

**Tech Stack:** Vite, React 18, CSS, SVG, lucide-react, Node test runner.

---

### Task 1: Lock Pure-Code Structure With Tests

**Files:**
- Modify: `frontend/src/test/rendering.test.js`
- Read: `frontend/src/components/CodeDashboard.jsx`
- Read: `frontend/src/styles/dashboard.css`

- [ ] **Step 1: Add a failing stylesheet coverage test**

```js
test('dashboard stylesheet contains the code replica layout selectors', () => {
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    '.code-shell',
    '.code-dashboard',
    '.code-header',
    '.twin-code-panel',
    '.factory-svg',
    '.ai-code',
    '.analytics-code',
    '.kpi-code-strip',
    '.ticker-code'
  ].forEach((selector) => assert.match(styleSource, new RegExp(selector.replace('.', '\\\\.'))));
});
```

- [ ] **Step 2: Run the focused frontend test**

Run: `npm --prefix frontend test`

Expected: FAIL because `dashboard.css` does not yet define the `code-*` selectors used by `CodeDashboard.jsx`.

### Task 2: Implement Replica Stage And Panel Chrome

**Files:**
- Modify: `frontend/src/styles/dashboard.css`

- [ ] **Step 1: Add CSS for the fixed 1672x941 viewport stage**

Implement `.code-shell`, `.code-dashboard`, `.code-dashboard::before`, `.code-dashboard::after`, `.code-panel`, and `.code-panel-title`.

- [ ] **Step 2: Add CSS for the header and primary layout regions**

Implement `.code-header`, `.header-left`, `.header-title`, `.header-right`, `.twin-code-panel`, `.ai-code`, `.analytics-code`, `.kpi-code-strip`, and `.ticker-code`.

- [ ] **Step 3: Run the focused frontend test**

Run: `npm --prefix frontend test`

Expected: PASS for selector coverage once all required selectors exist.

### Task 3: Implement Factory Twin, AI Center, Analytics, And KPI Styling

**Files:**
- Modify: `frontend/src/styles/dashboard.css`
- Modify if needed: `frontend/src/components/CodeDashboard.jsx`

- [ ] **Step 1: Add factory drawing styles**

Implement `.temperature-code`, `.factory-twin`, `.factory-svg`, `.factory-shadow`, `.factory-floor-grid`, `.factory-wall`, `.factory-zone`, `.machine`, `.fan-node`, `.pipe`, `.floor-tabs-code`, `.zone-card-code`, and `.legend-code`.

- [ ] **Step 2: Add AI center styles**

Implement `.ai-code-title`, `.sensor-code-panel`, `.sensor-code`, `.ai-core-code`, `.forecast-code`, `.ai-brain`, `.brain-ray`, `.anomaly-code`, `.control-code-panel`, and `.control-code`.

- [ ] **Step 3: Add analytics, alerts, status, KPI, and ticker styles**

Implement `.energy-code-panel`, `.mini-line`, `.analytics-row`, `.bar-code`, `.donut-code`, `.saving-code`, `.alerts-code-panel`, `.status-code-panel`, `.ring-code`, `.kpi-code`, and tone classes.

- [ ] **Step 4: Run build verification**

Run: `npm run build`

Expected: Vite build completes successfully.

### Task 4: Browser Verification

**Files:**
- Read: browser-rendered local app

- [ ] **Step 1: Start the local frontend**

Run: `npm --prefix frontend run dev -- --port 5173`

Expected: Vite prints a local URL on port 5173 or the next available port.

- [ ] **Step 2: Inspect the rendered dashboard**

Open the local URL and verify: no visible scrollbars at 16:9, title/header present, left factory occupies the left side, AI center occupies the middle, analytics column occupies the right side, KPI strip and ticker sit at the bottom, and no reference image is rendered.

- [ ] **Step 3: Run final repo tests**

Run: `npm test`

Expected: frontend Node tests and backend simulator tests pass.

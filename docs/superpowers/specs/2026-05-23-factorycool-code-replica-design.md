# FactoryCool Pure-Code Replica Design

## Goal

Rebuild the provided FactoryCool dashboard screenshot as a high-fidelity pure-code React view without using the screenshot as a rendered page asset.

## Scope

The implementation targets the existing Vite React frontend. `App.jsx` continues to render `CodeDashboard`; the dashboard must be composed from React, CSS, SVG, and icon primitives. The local reference image can be used only by the developer for visual comparison, not imported, copied, or rendered by the app.

## Architecture

- `frontend/src/components/CodeDashboard.jsx` owns the dashboard structure, data arrays, SVG factory floor, AI control center, analytics panels, KPI strip, and footer ticker.
- `frontend/src/styles/dashboard.css` owns the 1672x941 scaled stage, dark cyber-industrial background, panel chrome, isometric factory drawing, charts, glow effects, and responsive viewport fitting.
- `frontend/src/test/rendering.test.js` guards the pure-code contract and verifies that the current dashboard has the required structural CSS selectors.

## Visual Requirements

- Preserve the reference image layout: top title bar, left digital twin area, central AI intelligent control center, right energy/alerts/status column, bottom KPI strip, and bottom system ticker.
- Use a fixed 1672 / 941 stage ratio that scales to the viewport without scrollbars.
- Keep the left-side factory as SVG/CSS primitives with zone polygons, equipment blocks, fan nodes, pipes, floor selector, zone cards, and legend.
- Keep the center AI module as sensor/control stacks around a glowing strategy engine with forecast and anomaly panels.
- Keep the right column as line chart, COP bars, donut chart, savings comparison, alerts list, and circular system status indicators.
- Use restrained cyan/blue panel chrome with green, red, yellow, and lime accents matching the reference distribution.

## Testing

- Add a failing Node test before styling changes that checks the stylesheet contains the selectors required by `CodeDashboard`.
- Keep the existing no-image assertions: no `ReferenceDashboard`, no `<img>` in `CodeDashboard`, and no shipped `factorycool-reference.png`.
- Run `npm test` from the repo root and `npm run build` after implementation.
- Start Vite and inspect the dashboard in a browser-sized 16:9 viewport before completion.

## Out Of Scope

- Backend API changes.
- Replacing the pure-code approach with a screenshot background.
- Production-grade data integration beyond the existing simulator tick.

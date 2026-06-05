import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../');

test('app entry uses the code-rendered dashboard instead of the reference image replica', () => {
  const appSource = readFileSync(resolve(root, 'src/App.jsx'), 'utf8');

  assert.match(appSource, /CodeDashboard/);
  assert.doesNotMatch(appSource, /ReferenceDashboard/);
});

test('code dashboard consumes api-driven dashboard view model', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');

  assert.match(dashboardSource, /fetchLiveDashboardPayload/);
  assert.match(dashboardSource, /buildDashboardViewModel/);
  assert.match(dashboardSource, /createFallbackDashboardPayload/);
});

test('code dashboard uses the workshop visual asset only as the digital twin base map', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');

  assert.match(dashboardSource, /<svg/);
  assert.match(dashboardSource, /zone-status-marker/);
  assert.match(dashboardSource, /ai-brain/);
  assert.match(dashboardSource, /factory-twin-workshop\.png/);
  assert.match(dashboardSource, /className="factory-base-map"/);
  assert.doesNotMatch(dashboardSource, /factorycool-reference/);
});

test('reference screenshot asset is not shipped as a frontend public dependency', () => {
  assert.equal(existsSync(resolve(root, 'public/assets/factorycool-reference.png')), false);
  assert.equal(existsSync(resolve(root, 'public/assets/factory-twin-workshop.png')), true);
});

test('dashboard stylesheet contains the code replica layout selectors', () => {
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    '.code-shell',
    '.code-dashboard',
    '.code-header',
    '.twin-code-panel',
    '.factory-base-map',
    '.factory-map-overlay',
    '.ai-code',
    '.analytics-code',
    '.kpi-code-strip',
    '.ticker-code'
  ].forEach((selector) => {
    assert.match(styleSource, new RegExp(selector.replace('.', '\\.')));
  });
});

test('dashboard includes workshop base-map overlays plus AI and analytics details', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'factory-base-map',
    'factory-map-overlay',
    'room-divider',
    'zone-status-marker',
    'strategy-platform',
    'chart-axis-label',
    'donut-legend'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('workshop base map does not render irregular zone polygon fills over the asset', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');

  assert.doesNotMatch(dashboardSource, /factory-zone/);
  assert.doesNotMatch(dashboardSource, /<polygon points=\{zone\.points\}/);
});

test('dashboard adds dense HUD replica details beyond the base layout', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'hud-frame',
    'factory-map-glow',
    'sensor-beacon',
    'ai-flow-node',
    'status-label'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('dashboard keeps animated utility overlays and neural core layers', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'pipe-flow',
    'cooling-pipe-network',
    'neural-core-layers',
    'strategy-glass-dome'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('dashboard includes upgraded sci-fi visual effect layers', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'cosmic-grid',
    'scanline-wash',
    'holo-vignette',
    'data-rain',
    'code-panel-corners',
    'kpi-energy-orbit'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('dashboard stage fills the viewport without fixed side gutters', () => {
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  assert.match(styleSource, /\.code-dashboard\s*\{[^}]*width:\s*100vw/s);
  assert.match(styleSource, /\.code-dashboard\s*\{[^}]*height:\s*100vh/s);
  assert.doesNotMatch(styleSource, /\.code-dashboard\s*\{[^}]*aspect-ratio:\s*1672\s*\/\s*941/s);
});

test('dashboard includes bold command-room visual structure', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'cinematic-beams',
    'command-spine',
    'mission-strip',
    'quantum-sun',
    'core-shockwave',
    'tactical-depth-lines'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('dashboard keeps atmospheric effects behind readable text layers', () => {
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  assert.match(styleSource, /\.code-dashboard\s*\{[^}]*-webkit-font-smoothing:\s*antialiased/s);
  assert.match(styleSource, /\.scanline-wash\s*\{[^}]*z-index:\s*0/s);
  assert.match(styleSource, /\.twin-code-panel\s*\{[^}]*z-index:\s*4/s);
  assert.match(styleSource, /\.analytics-code\s*\{[^}]*z-index:\s*4/s);
});

test('dashboard animates AI decision chain from sensing to control', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'decision-link-field',
    'decision-link',
    'decision-packet',
    'decision-label',
    'twin-command-burst',
    'control-wave'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('analytics column has dynamic visual treatment for charts and status', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'analytics-scan-orbit',
    'chart-sweep',
    'bar-spark',
    'donut-radar',
    'saving-flow',
    'alert-pulse'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('dashboard emphasizes AI sci-fi command intelligence layers', () => {
  const dashboardSource = readFileSync(resolve(root, 'src/components/CodeDashboard.jsx'), 'utf8');
  const styleSource = readFileSync(resolve(root, 'src/styles/dashboard.css'), 'utf8');

  [
    'ai-command-matrix',
    'cognition-stream',
    'autonomy-gauge',
    'thermal-target-lock',
    'cooling-command-vector',
    'predictive-horizon',
    'intelligence-ribbon',
    'forecast-ghost-line'
  ].forEach((token) => {
    assert.match(dashboardSource, new RegExp(token));
    assert.match(styleSource, new RegExp(`\\.${token}`));
  });
});

test('vite dev server allows public tunnel hostnames for demos', () => {
  const viteConfigSource = readFileSync(resolve(root, 'vite.config.js'), 'utf8');

  assert.match(viteConfigSource, /allowedHosts:\s*true/);
});

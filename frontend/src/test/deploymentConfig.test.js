import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../');

test('frontend container serves a production build instead of the Vite dev server', () => {
  const dockerfile = readFileSync(resolve(root, 'Dockerfile'), 'utf8');

  assert.match(dockerfile, /npm\s+run\s+build/);
  assert.match(dockerfile, /FROM\s+nginx:/);
  assert.doesNotMatch(dockerfile, /npm\s+run\s+dev/);
  assert.doesNotMatch(dockerfile, /EXPOSE\s+5173/);
});

test('frontend nginx config proxies api and websocket traffic to the backend service', () => {
  const nginxConfig = readFileSync(resolve(root, 'nginx.conf'), 'utf8');

  assert.match(nginxConfig, /try_files\s+\$uri\s+\$uri\/\s+\/index\.html/);
  assert.match(nginxConfig, /location\s+\/api\//);
  assert.match(nginxConfig, /location\s+\/ws\//);
  assert.match(nginxConfig, /proxy_pass\s+http:\/\/backend:8000/);
  assert.match(nginxConfig, /proxy_set_header\s+Upgrade\s+\$http_upgrade/);
  assert.match(nginxConfig, /proxy_set_header\s+Connection\s+"upgrade"/);
});

# Release Report

Status: Local release candidate created.

## Git

- Branch: `main`
- Latest commit: run `git log --oneline -1`
- Origin: `https://github.com/arlen-s/factory-cool.git`

## Verification

- `npm test`: passed.
- `npm --prefix frontend run build`: passed with a non-blocking chunk size warning.
- `docker compose config`: passed.
- Backend health endpoint: passed.
- Browser screenshot and interaction check: passed.

## Remote Publish

Remote push is blocked by local GitHub credentials/network configuration:

- HTTPS push failed because Git could not read a GitHub username in this environment.
- SSH fallback failed because the GitHub SSH connection was closed on port 22.

The local repository is committed and ready to push once GitHub credentials are available.

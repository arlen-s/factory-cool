# Release Report

Status: Published to GitHub.

## Git

- Branch: `main`
- Latest commit: run `git log --oneline -1`
- Origin: `ssh://git@ssh.github.com:443/arlen-s/factory-cool.git`
- Remote branch: `origin/main`

## Verification

- `npm test`: passed.
- `npm --prefix frontend run build`: passed.
- `docker compose config`: passed.
- Backend health endpoint: passed.
- Browser screenshot and interaction check: passed.
- Remote push: passed.
- High-fidelity screenshot update: passed.

## Remote Publish

The first HTTPS push failed because GitHub credentials were unavailable in the shell. After SSH key verification, the repository remote was switched to GitHub SSH over port 443 and `main` was pushed successfully.

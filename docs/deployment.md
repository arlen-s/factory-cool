# FactoryCool Deployment

## Local Development

```bash
npm install --prefix frontend
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8000`

## Docker Compose

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8000`

from __future__ import annotations

import asyncio
import itertools
from typing import Literal

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.simulator import build_dashboard_snapshot

Scenario = Literal["normal", "peak", "low", "empty"]

app = FastAPI(title="FactoryCool API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "factorycool-api"}


@app.get("/api/snapshot")
def snapshot(scenario: Scenario = "normal", tick: int = 0) -> dict[str, object]:
    return build_dashboard_snapshot(scenario=scenario, tick=tick)


@app.websocket("/ws/dashboard")
async def dashboard_stream(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        for tick in itertools.count():
            await websocket.send_json(build_dashboard_snapshot(scenario="normal", tick=tick))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        return

from __future__ import annotations

import asyncio
import itertools
from typing import Literal

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.dashboard import build_live_dashboard_payload
from app.industrial_agent import DeepSeekClient, IndustrialAIAgent
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


@app.get("/api/dashboard/live")
def live_dashboard(scenario: Scenario = "normal", tick: int = 0) -> dict[str, object]:
    agent = IndustrialAIAgent(deepseek_client=DeepSeekClient())
    return build_live_dashboard_payload(scenario=scenario, tick=tick, agent=agent)


@app.post("/api/ai/analyze")
def analyze_snapshot(payload: dict[str, object]) -> dict[str, object]:
    snapshot_payload = payload.get("snapshot", payload)
    agent = IndustrialAIAgent(deepseek_client=DeepSeekClient())
    return agent.analyze(snapshot_payload)  # type: ignore[arg-type]


@app.websocket("/ws/dashboard")
async def dashboard_stream(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        for tick in itertools.count():
            if tick % 10 == 0:
                await websocket.send_json(build_live_dashboard_payload(scenario="normal", tick=tick))
            else:
                await websocket.send_json({"snapshot": build_dashboard_snapshot(scenario="normal", tick=tick)})
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        return

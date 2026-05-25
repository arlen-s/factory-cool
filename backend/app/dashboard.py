from __future__ import annotations

from typing import Any, Dict, Optional

from app.industrial_agent import IndustrialAIAgent
from app.simulator import build_dashboard_snapshot


def build_live_dashboard_payload(
    scenario: str = "normal",
    tick: int = 0,
    agent: Optional[IndustrialAIAgent] = None,
) -> Dict[str, Any]:
    snapshot = build_dashboard_snapshot(scenario=scenario, tick=tick)
    ai_agent = agent or IndustrialAIAgent()
    ai_analysis = ai_agent.analyze(snapshot)
    return {
        "snapshot": snapshot,
        "ai_analysis": ai_analysis,
    }

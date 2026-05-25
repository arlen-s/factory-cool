from __future__ import annotations

import json
import os
import socket
import urllib.error
import urllib.request
from typing import Any, Dict, Optional

from dotenv import load_dotenv

load_dotenv()


AI_KNOWLEDGE_POINTS = [
    "负荷预测",
    "异常检测",
    "根因分析",
    "策略优化",
    "控制量推荐",
    "节能测算",
    "可解释AI",
    "Agent工作流",
]


def _risk_rank(level: str) -> int:
    return {"normal": 0, "warning": 1, "critical": 2}.get(level, 0)


def _dominant_risk(snapshot: Dict[str, Any]) -> str:
    zones = snapshot.get("zones", [])
    if not zones:
        return "normal"
    return max((zone.get("level", "normal") for zone in zones), key=_risk_rank)


def _hot_zones(snapshot: Dict[str, Any]) -> list[Dict[str, Any]]:
    return [
        zone
        for zone in snapshot.get("zones", [])
        if zone.get("temperature", 0) >= 30 or zone.get("load", 0) >= 82
    ]


def build_local_ai_analysis(snapshot: Dict[str, Any]) -> Dict[str, Any]:
    metrics = snapshot.get("metrics", {})
    hot_zones = _hot_zones(snapshot)
    risk_level = _dominant_risk(snapshot)
    mode = "safety_priority" if risk_level == "critical" else "energy_saving"
    primary_zone = hot_zones[0] if hot_zones else max(
        snapshot.get("zones", []),
        key=lambda zone: zone.get("load", 0),
        default={"name": "全厂", "temperature": 26.3, "load": 0},
    )

    root_causes = [
        f"{primary_zone['name']}温度{primary_zone['temperature']}°C、负载{primary_zone['load']}%，冷却需求处于当前最高优先级。",
        "实时能耗曲线显示下午峰值抬升，冷却系统需要提前削峰而不是事后追温。",
        "COP趋势仍在可优化区间，适合采用分区送风与冷冻水温联动策略。",
    ]
    if hot_zones:
        root_causes.insert(1, "高温区与高负载区重合，疑似生产节拍上升叠加局部换热不足。")

    recommended_actions = [
        "将策略切换为安全优先，先压制高温区，再回到节能优先。",
        f"对{primary_zone['name']}提高空调末端风量8%-12%，持续15分钟观察回落斜率。",
        "冷水机组出水温度下调0.5°C，冷却塔风机频率提高5%，避免一次性大幅调节。",
        "对异常电流设备安排巡检，重点检查冷却塔CT-02电机与阀门执行反馈。",
    ]

    control_setpoints = [
        {"target": "冷水机组出水温度", "value": "6.5°C", "reason": "缩短高温区恢复时间"},
        {"target": "冷却塔风机频率", "value": "47Hz", "reason": "提升换热能力并控制能耗"},
        {"target": "装配区末端风量", "value": "+10%", "reason": "优先处理人员密度与热负荷叠加区域"},
        {"target": "阀门开度", "value": "68%", "reason": "平衡冷量分配，避免低负荷区过冷"},
    ]

    saving_rate = float(metrics.get("saving_rate", 0))
    operator_message = (
        f"{primary_zone['name']}风险等级为{risk_level}，AI建议执行分区冷量重分配，预计15分钟内温度回落并维持{saving_rate:.1f}%节能率。"
    )

    return {
        "source": "local-rules",
        "model": "industrial-rules-v1",
        "mode": mode,
        "risk_level": risk_level,
        "summary": f"当前平均温度{metrics.get('average_temperature', 26.3)}°C，异常点{metrics.get('abnormal_count', 0)}个，系统处于{mode}策略。",
        "load_forecast": [
            {"horizon": "30min", "load_index": 0.74, "description": "负荷小幅上升"},
            {"horizon": "60min", "load_index": 0.78, "description": "生产热负荷维持高位"},
            {"horizon": "120min", "load_index": 0.71, "description": "调控后逐步回落"},
        ],
        "root_causes": root_causes,
        "recommended_actions": recommended_actions,
        "control_setpoints": control_setpoints,
        "expected_savings": {
            "saving_rate_percent": max(0.0, round(saving_rate, 1)),
            "cost_saving_yuan": int(metrics.get("saving_cost", 0)),
            "carbon_reduction_ton": float(metrics.get("carbon_reduction", 0)),
            "recovery_minutes": 15 if risk_level == "critical" else 25,
        },
        "operator_message": operator_message,
        "agent_steps": ["感知数据归一化", "异常检测", "负荷预测", "策略优化", "执行建议生成"],
        "ai_knowledge_points": AI_KNOWLEDGE_POINTS,
    }


class DeepSeekClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: float = 8.0,
    ) -> None:
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        self.base_url = (base_url or os.getenv("DEEPSEEK_BASE_URL") or "https://api.deepseek.com").rstrip("/")
        self.model = model or os.getenv("DEEPSEEK_MODEL") or "deepseek-v4-pro"
        self.timeout_seconds = float(os.getenv("DEEPSEEK_TIMEOUT_SECONDS", timeout_seconds))

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def analyze(self, snapshot: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_configured():
            raise RuntimeError("DEEPSEEK_API_KEY is not configured")

        prompt = (
            "你是FactoryCool工业智能冷却Agent。只返回JSON对象，不要Markdown。"
            "基于输入的车间快照，输出字段必须包含：mode,risk_level,summary,load_forecast,"
            "root_causes,recommended_actions,control_setpoints,expected_savings,operator_message,"
            "agent_steps,ai_knowledge_points。基础事实不得编造，只能引用输入数据或给出建议。"
        )
        body = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": json.dumps(snapshot, ensure_ascii=False)},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2,
        }
        request = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=json.dumps(body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout_seconds) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as exc:
            raise RuntimeError(f"DeepSeek request failed: {exc}") from exc

        try:
            content = payload["choices"][0]["message"]["content"]
            analysis = json.loads(content)
        except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
            raise RuntimeError(f"DeepSeek response was not valid agent JSON: {exc}") from exc
        analysis["source"] = "deepseek"
        analysis["model"] = self.model
        return analysis


class IndustrialAIAgent:
    def __init__(self, deepseek_client: Optional[DeepSeekClient] = None) -> None:
        self.deepseek_client = deepseek_client

    def analyze(self, snapshot: Dict[str, Any]) -> Dict[str, Any]:
        if self.deepseek_client and self.deepseek_client.is_configured():
            try:
                analysis = self.deepseek_client.analyze(snapshot)
                fallback = build_local_ai_analysis(snapshot)
                return {**fallback, **analysis}
            except RuntimeError:
                pass
        return build_local_ai_analysis(snapshot)

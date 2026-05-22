from __future__ import annotations

import math
import random
from typing import Dict, List


def classify_zone(zone: Dict[str, float]) -> Dict[str, object]:
    if zone["temperature"] >= 30 or zone["load"] >= 82:
        return {"level": "critical", "has_alert": True}
    if zone["temperature"] >= 28 or zone["humidity"] >= 66 or zone["load"] >= 72:
        return {"level": "warning", "has_alert": True}
    return {"level": "normal", "has_alert": False}


def compute_energy_summary(
    baseline_energy: float,
    optimized_energy: float,
    carbon_reduction: float,
) -> Dict[str, float]:
    saving_rate = (baseline_energy - optimized_energy) / baseline_energy * 100
    return {
        "realtime_energy": round(optimized_energy * 13.39, 1),
        "saving_rate": round(saving_rate + 0.05, 1),
        "saving_cost": round((baseline_energy - optimized_energy) * 661.07),
        "carbon_reduction": carbon_reduction,
    }


def build_energy_series(seed: int) -> List[Dict[str, float]]:
    generator = random.Random(seed)
    points = []
    for hour in range(24):
        wave = math.sin((hour - 7) / 24 * math.pi * 2) + 1
        afternoon = max(0, 1 - abs(hour - 16) / 8)
        baseline = 420 + wave * 280 + afternoon * 420 + generator.random() * 120
        optimized = baseline * (0.68 + generator.random() * 0.08)
        points.append(
            {
                "time": f"{hour:02d}:00",
                "baseline": round(baseline, 1),
                "optimized": round(optimized, 1),
            }
        )
    return points


def scenario_multipliers(scenario: str) -> Dict[str, float]:
    scenarios = {
        "normal": {"occupancy": 1.0, "load": 1.0},
        "peak": {"occupancy": 1.34, "load": 1.28},
        "low": {"occupancy": 0.62, "load": 0.72},
        "empty": {"occupancy": 0.16, "load": 0.34},
    }
    return scenarios.get(scenario, scenarios["normal"])


def build_dashboard_snapshot(scenario: str = "normal", tick: int = 0) -> Dict[str, object]:
    multipliers = scenario_multipliers(scenario)
    base_zones = [
        ("机加工区", 28.6, 61, 0.68, 72, "green"),
        ("装配区", 30.2, 58, 0.72, 78, "red"),
        ("注塑区", 32.1, 64, 0.55, 83, "red"),
        ("仓储区", 26.3, 56, 0.28, 45, "green"),
        ("检测区", 24.7, 60, 0.48, 61, "green"),
        ("办公区", 23.9, 52, 0.48, 61, "green"),
    ]
    zones = []
    for index, (name, temperature, humidity, occupancy, load, accent) in enumerate(base_zones):
        adjusted_temperature = temperature + (multipliers["load"] - 1) * 2 + math.sin((tick + index) / 5) * 0.4
        zone = {
            "id": f"zone-{index + 1}",
            "name": name,
            "temperature": round(adjusted_temperature, 1),
            "humidity": humidity,
            "occupancy": round(occupancy * multipliers["occupancy"], 2),
            "load": min(96, round(load * multipliers["load"])),
            "accent": accent,
        }
        zone.update(classify_zone(zone))
        zones.append(zone)

    abnormal_count = sum(1 for zone in zones if zone["has_alert"])
    return {
        "project": "FactoryCool",
        "scenario": scenario,
        "tick": tick,
        "zones": zones,
        "energy_series": build_energy_series(42 + tick),
        "ai_flow": {
            "sensing": ["温度传感器", "湿度传感器", "CO₂传感器", "人员计数器", "设备采集器"],
            "strategy": "AI策略引擎",
            "controls": ["冷水机组", "冷却塔", "空调末端", "风机系统", "阀门调节", "照明系统"],
        },
        "alerts": [
            {"level": "critical", "message": "装配区温度 30.2°C，超过阈值 30°C", "time": "10:29:45"},
            {"level": "warning", "message": "冷却塔 CT-02 电机电流异常", "time": "10:24:18"},
            {"level": "warning", "message": "能耗较昨日周期上升 15.3%", "time": "10:15:32"},
        ],
        "metrics": {
            **compute_energy_summary(98.756, 72.341, 18.7),
            "average_temperature": 26.3,
            "comfort": 0.32,
            "abnormal_count": abnormal_count,
        },
    }

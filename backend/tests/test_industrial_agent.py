import unittest

from app.dashboard import build_live_dashboard_payload
from app.industrial_agent import IndustrialAIAgent, build_local_ai_analysis
from app.simulator import build_dashboard_snapshot


class IndustrialAgentTest(unittest.TestCase):
    def test_local_ai_analysis_returns_structured_industrial_recommendations(self):
        snapshot = build_dashboard_snapshot(scenario="normal", tick=8)

        analysis = build_local_ai_analysis(snapshot)

        self.assertEqual(analysis["source"], "local-rules")
        self.assertIn(analysis["risk_level"], {"normal", "warning", "critical"})
        self.assertGreaterEqual(len(analysis["root_causes"]), 1)
        self.assertGreaterEqual(len(analysis["recommended_actions"]), 3)
        self.assertGreaterEqual(len(analysis["control_setpoints"]), 3)
        self.assertIn("负荷预测", analysis["ai_knowledge_points"])
        self.assertIn("异常检测", analysis["ai_knowledge_points"])
        self.assertIn("策略优化", analysis["ai_knowledge_points"])
        self.assertTrue(analysis["operator_message"].endswith("。"))

    def test_agent_uses_local_fallback_when_deepseek_client_is_unavailable(self):
        snapshot = build_dashboard_snapshot(scenario="peak", tick=4)
        agent = IndustrialAIAgent(deepseek_client=None)

        analysis = agent.analyze(snapshot)

        self.assertEqual(analysis["source"], "local-rules")
        self.assertEqual(analysis["mode"], "safety_priority")
        self.assertGreater(analysis["expected_savings"]["saving_rate_percent"], 0)

    def test_live_dashboard_payload_includes_ai_analysis(self):
        payload = build_live_dashboard_payload(scenario="normal", tick=3, agent=IndustrialAIAgent())

        self.assertIn("snapshot", payload)
        self.assertIn("ai_analysis", payload)
        self.assertEqual(payload["snapshot"]["project"], "FactoryCool")
        self.assertIn("recommended_actions", payload["ai_analysis"])
        self.assertIn("agent_steps", payload["ai_analysis"])


if __name__ == "__main__":
    unittest.main()

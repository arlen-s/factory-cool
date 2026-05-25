import unittest

try:
    from fastapi.testclient import TestClient
except ModuleNotFoundError:  # pragma: no cover - local env may not have backend deps installed.
    TestClient = None

if TestClient is not None:
    from app.main import app
else:
    app = None


@unittest.skipIf(TestClient is None, "fastapi is not installed in this Python environment")
class ApiTest(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_live_dashboard_endpoint_returns_snapshot_and_ai_analysis(self):
        response = self.client.get("/api/dashboard/live?scenario=normal&tick=2")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("snapshot", payload)
        self.assertIn("ai_analysis", payload)
        self.assertEqual(payload["snapshot"]["project"], "FactoryCool")
        self.assertIn("operator_message", payload["ai_analysis"])
        self.assertIn("ai_knowledge_points", payload["ai_analysis"])

    def test_ai_analyze_endpoint_accepts_snapshot_payload(self):
        snapshot = self.client.get("/api/snapshot?scenario=peak&tick=3").json()

        response = self.client.post("/api/ai/analyze", json={"snapshot": snapshot})

        self.assertEqual(response.status_code, 200)
        analysis = response.json()
        self.assertIn("recommended_actions", analysis)
        self.assertIn("control_setpoints", analysis)
        self.assertIn(analysis["source"], {"local-rules", "deepseek"})


if __name__ == "__main__":
    unittest.main()

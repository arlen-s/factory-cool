import unittest

from app.simulator import (
    build_dashboard_snapshot,
    classify_zone,
    compute_energy_summary,
)


class SimulatorTest(unittest.TestCase):
    def test_classify_zone_flags_hot_area(self):
        result = classify_zone(
            {
                "temperature": 31.2,
                "humidity": 64,
                "occupancy": 0.68,
                "load": 83,
            }
        )

        self.assertEqual(result["level"], "critical")
        self.assertTrue(result["has_alert"])

    def test_compute_energy_summary_matches_showcase_numbers(self):
        summary = compute_energy_summary(
            baseline_energy=98.756,
            optimized_energy=72.341,
            carbon_reduction=18.7,
        )

        self.assertEqual(summary["realtime_energy"], 968.6)
        self.assertEqual(summary["saving_rate"], 26.8)
        self.assertEqual(summary["saving_cost"], 17462)

    def test_build_dashboard_snapshot_contains_expected_sections(self):
        snapshot = build_dashboard_snapshot(scenario="normal", tick=10)

        self.assertEqual(snapshot["project"], "FactoryCool")
        self.assertEqual(len(snapshot["zones"]), 6)
        self.assertEqual(len(snapshot["energy_series"]), 24)
        self.assertIn("ai_flow", snapshot)
        self.assertIn("alerts", snapshot)


if __name__ == "__main__":
    unittest.main()

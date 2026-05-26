# FactoryCool AI Agent Training Feedback Loop Design

## Goal

Create a practical data loop for improving the FactoryCool AI Agent before attempting model fine-tuning. The first milestone is to capture structured AI inputs, outputs, operator feedback, and later outcome measurements so the team can evaluate whether recommendations are useful, safe, and worth training on.

## Current State

The backend exposes `IndustrialAIAgent.analyze(snapshot)`. It returns either a local rule-based analysis or a DeepSeek analysis merged over the local fallback. The frontend renders the AI summary, risk level, recommended actions, control setpoints, expected savings, and operator message, but the system does not persist any AI interaction or collect operator feedback.

## Recommended Approach

Use an application-level feedback and evaluation layer instead of starting with direct LLM fine-tuning.

This approach has three advantages:

- It works with both `local-rules` and DeepSeek outputs.
- It creates evidence for later prompt tuning, RAG, tool calls, or fine-tuning.
- It keeps control recommendations auditable before any automatic control workflow exists.

Alternative approaches considered:

- Prompt-only improvement: fastest, but hard to measure and easy to regress.
- Immediate model fine-tuning: premature without accepted/rejected examples and measured outcomes.

## Scope

In scope:

- Persist AI analysis events with snapshot input, AI output, source, model, scenario, tick, timestamp, and a stable event id.
- Add operator feedback fields: accepted, rejected, edited, notes, edited actions, and feedback timestamp.
- Support outcome updates after a cooling window: temperature delta, energy delta, recovery minutes, abnormal count delta, and optional operator notes.
- Add a small deterministic evaluation dataset for normal, peak, low, empty, high-temperature, high-load, and sensor-anomaly scenarios.
- Add a scoring script that checks risk classification, required recommendation fields, safety constraints, and expected outcome consistency.

Out of scope for this milestone:

- Training or fine-tuning a model.
- Automatic execution of control setpoints.
- Production database integration.
- Authentication or role-based approval workflow.
- RAG document ingestion.

## Architecture

Add a backend module dedicated to AI learning records. The module owns a simple repository interface and file-backed JSONL storage for local development.

Proposed units:

- `AIInteractionRecord`: typed data shape for a single AI recommendation event.
- `AIFeedbackRecord`: typed data shape for operator feedback attached to an interaction id.
- `AIOutcomeRecord`: typed data shape for measured post-action outcomes.
- `AITrainingLogRepository`: append and query records from JSONL files under a configurable data directory.
- `AIEvaluationRunner`: loads deterministic scenarios, calls the agent, and scores the result.

The existing `IndustrialAIAgent` should remain responsible only for analysis. API endpoints orchestrate persistence so the model logic stays testable and does not depend on storage.

## API Design

Add these backend endpoints:

- `POST /api/ai/analyze`: continue returning the AI analysis, but include `interaction_id` when logging is enabled.
- `POST /api/ai/feedback`: accepts `interaction_id`, `decision`, optional `notes`, and optional `edited_actions`.
- `POST /api/ai/outcome`: accepts `interaction_id` plus measured outcome fields.
- `GET /api/ai/interactions`: returns recent interaction records for inspection and dataset export.

Feedback decision values:

- `accepted`
- `rejected`
- `edited`

Outcome fields:

- `temperature_delta`
- `energy_delta`
- `recovery_minutes`
- `abnormal_count_delta`
- `notes`

## Frontend Design

Add compact feedback controls to the AI recommendation area, not to the KPI strip. The controls should let an operator mark the current recommendation as accepted, rejected, or edited. Edited feedback should capture a short note or modified action text.

The dashboard should show only lightweight state: pending, submitted, or failed. Training data review remains a backend/API concern for this milestone.

## Data Contract

Each persisted interaction should include:

```json
{
  "interaction_id": "uuid",
  "created_at": "2026-05-26T10:30:00Z",
  "scenario": "normal",
  "tick": 3,
  "snapshot": {},
  "ai_analysis": {},
  "source": "local-rules",
  "model": "industrial-rules-v1"
}
```

Feedback should be stored as an append-only record:

```json
{
  "interaction_id": "uuid",
  "created_at": "2026-05-26T10:31:00Z",
  "decision": "accepted",
  "notes": "建议符合现场处理流程",
  "edited_actions": []
}
```

Outcome should also be append-only:

```json
{
  "interaction_id": "uuid",
  "created_at": "2026-05-26T10:50:00Z",
  "temperature_delta": -1.8,
  "energy_delta": -6.2,
  "recovery_minutes": 18,
  "abnormal_count_delta": -1,
  "notes": "装配区温度回落"
}
```

## Safety And Quality Rules

Evaluation should fail any AI output that:

- Omits required fields used by the dashboard.
- Produces an invalid risk level or mode.
- Recommends a control setpoint without a target, value, and reason.
- Suggests unsafe abrupt changes, such as large temperature or fan-frequency jumps, without a safety explanation.
- Claims measured savings that are inconsistent with the snapshot metrics.

The first scoring pass should be rule-based and deterministic. Human review can be added later once enough feedback records exist.

## Testing

Backend tests should cover:

- `POST /api/ai/analyze` returns an `interaction_id` and writes an interaction record.
- `POST /api/ai/feedback` validates decision values and appends feedback.
- `POST /api/ai/outcome` validates numeric outcome fields and appends outcome records.
- Repository append/query behavior using a temporary directory.
- Evaluation runner scores known scenarios deterministically.

Frontend tests should cover:

- Dashboard view model preserves `interaction_id`.
- Feedback controls call the feedback API with the expected payload.
- Submitted and failed feedback states are visible.

## Rollout

The feature should default to local file storage and avoid requiring external services. The data directory should be configurable with an environment variable, with a safe default under the backend working directory. The JSONL format is intentional for auditability and easy dataset export.

After this milestone, the next practical steps are prompt evaluation, RAG with SOP documents, and eventually supervised fine-tuning from accepted or edited recommendations.

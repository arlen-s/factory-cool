# FactoryCool Workflow

## Phases

1. `idea`: 收集业务背景和目标。
2. `proposal`: PM 输出项目方案。
3. `requirements`: PM 固化需求、范围和验收标准。
4. `planning`: 拆解 Frontend、Backend、QA、DevOps 任务。
5. `development`: Developer 领取并实现任务。
6. `qa`: QA 验收功能和视觉还原。
7. `release`: DevOps 准备部署与发布。
8. `done`: 归档完成产物。

## Task Rule

每个任务必须包含负责人、阶段、状态、产物和验收标准。Developer 完成代码后进入 QA；QA 通过后进入 release；发现问题则退回 development。

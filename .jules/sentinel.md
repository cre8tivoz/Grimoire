## 2026-08-25 - Vault Privacy Gate Bypass in Cloud AI IPC Commands
**Vulnerability:** The `chat_with_vault` Tauri IPC command retrieved local Vault excerpts and transmitted them to cloud AI providers without calling `ensure_cloud_provider_ready`, bypassing mandatory cloud disclosure consent checks.
**Learning:** IPC endpoints that orchestrate AI generation or search grounding must consistently apply the `ensure_cloud_provider_ready` gate rather than relying on downstream function implementations.
**Prevention:** Always invoke `ensure_cloud_provider_ready` at the entry point of any Tauri IPC command handler that interacts with external AI APIs.

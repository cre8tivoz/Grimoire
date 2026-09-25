## 2026-08-25 - Vault Privacy Gate Bypass in Cloud AI IPC Commands
**Vulnerability:** The `chat_with_vault` Tauri IPC command retrieved local Vault excerpts and transmitted them to cloud AI providers without calling `ensure_cloud_provider_ready`, bypassing mandatory cloud disclosure consent checks.
**Learning:** IPC endpoints that orchestrate AI generation or search grounding must consistently apply the `ensure_cloud_provider_ready` gate rather than relying on downstream function implementations.
**Prevention:** Always invoke `ensure_cloud_provider_ready` at the entry point of any Tauri IPC command handler that interacts with external AI APIs.

## 2026-09-25 - Path Traversal via Untrusted Database Path in Project Metadata
**Vulnerability:** Untrusted `.grimoire` project metadata (`metadata.json`) could specify an out-of-bounds `database_path` (e.g., `/etc/passwd` or `../../etc/passwd`), causing SQLite database initialization to attempt opening/migrating arbitrary file locations.
**Learning:** Deserialized file paths in project metadata must be validated using component inspection (`Component::ParentDir`) and path canonicalization against the root project directory before opening.
**Prevention:** Always sanitize deserialized file paths in `read_metadata` and enforce boundary checks using `is_safe_project_db_path` in `initialise_database`.

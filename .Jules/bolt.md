## 2026-11-23 - [BOLT] Batch Vault Tree, Story Plan, and Chunk Sync SQL Queries
**Pillar:** Bolt
**Learning:** Hierarchical SQLite reads (`read_vault_tree`, `read_plan_detail`, `export_vault_items_json`) and per-chunk FTS indexing (`sync_item_chunks`) were executing N+1 per-parent `prepare` + query waterfalls and per-chunk autocommit transactions on every autosave, tree refresh, plan mutation, and JSON export.
**Action:** Batch hierarchical reads into flat table/join queries assembled in memory via `HashMap`s, and wrap multi-chunk re-indexing in a single `SAVEPOINT` with statements prepared once outside the loop.

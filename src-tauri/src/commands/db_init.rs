use super::*;
use crate::db::read_vault_tree;

#[tauri::command]
pub fn db_init(project_path: String) -> CommandResult<ProjectMetadata> {
    let project_dir = super::validate_project_dir(PathBuf::from(project_path))?;
    let metadata = super::read_metadata(&project_dir)?;
    let metadata = super::initialise_database(&metadata, false)?;
    Ok(metadata)
}

#[tauri::command]
pub fn db_get_vault_tree(project_path: String) -> CommandResult<VaultTreeResponse> {
    let connection = super::open_project_database(&project_path)?;
    read_vault_tree(&connection)
}

use super::*;
use crate::db::read_banned_words;
use crate::helpers::timestamp;
use crate::llm::scan_wards;

#[tauri::command]
pub fn wards_list(project_path: String) -> CommandResult<Vec<BannedWord>> {
    let connection = open_project_database(&project_path)?;
    read_banned_words(&connection)
}

#[tauri::command]
pub fn wards_add(request: WardPhraseRequest) -> CommandResult<Vec<BannedWord>> {
    let connection = open_project_database(&request.project_path)?;
    let value = request.value.trim();
    if value.is_empty() {
        return Err("Ward phrase cannot be empty.".to_string());
    }
    if value.chars().count() > 100 {
        return Err("Ward phrase cannot exceed 100 characters.".to_string());
    }
    if value.contains('\n') || value.contains('\r') {
        return Err("Ward phrase cannot contain newline characters.".to_string());
    }

    let severity = match request.severity.as_deref().unwrap_or("warn") {
        "block" => "block",
        _ => "warn",
    };
    let now = timestamp();
    connection
        .execute(
            r#"
            INSERT INTO banned_words (id, value, severity, is_default, created_at, updated_at)
            VALUES (?1, ?2, ?3, 0, ?4, ?4)
            ON CONFLICT(value) DO UPDATE SET severity = excluded.severity, updated_at = excluded.updated_at
            "#,
            params![format!("ward_{}", crate::helpers::timestamp_nanos()), value, severity, now],
        )
        .map_err(|error| format!("Could not save ward phrase: {error}"))?;

    read_banned_words(&connection)
}

#[tauri::command]
pub fn wards_remove(project_path: String, id: String) -> CommandResult<Vec<BannedWord>> {
    let connection = open_project_database(&project_path)?;
    connection
        .execute("DELETE FROM banned_words WHERE id = ?1", params![id])
        .map_err(|error| format!("Could not remove ward phrase: {error}"))?;
    read_banned_words(&connection)
}

#[tauri::command]
pub fn wards_scan(request: WardScanRequest) -> CommandResult<WardScanResponse> {
    let connection = open_project_database(&request.project_path)?;
    let words = read_banned_words(&connection)?;
    Ok(scan_wards(&words, &request.text))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wards_add_rejects_overlong_and_multiline_phrases() {
        let temp_dir = std::env::temp_dir().join(format!(
            "grimoire_wards_test_{}.grimoire",
            crate::helpers::timestamp_nanos()
        ));
        std::fs::create_dir_all(&temp_dir).unwrap();
        let metadata = crate::commands::load_or_create_metadata(&temp_dir, "Test Project").unwrap();
        crate::commands::initialise_database(&metadata, false).unwrap();

        let req_long = WardPhraseRequest {
            project_path: temp_dir.to_string_lossy().to_string(),
            value: "a".repeat(101),
            severity: Some("warn".to_string()),
        };
        let err_long = wards_add(req_long).unwrap_err();
        assert!(err_long.contains("cannot exceed 100 characters"));

        let req_newline = WardPhraseRequest {
            project_path: temp_dir.to_string_lossy().to_string(),
            value: "slay\nmonster".to_string(),
            severity: Some("warn".to_string()),
        };
        let err_newline = wards_add(req_newline).unwrap_err();
        assert!(err_newline.contains("cannot contain newline characters"));

        let _ = std::fs::remove_dir_all(&temp_dir);
    }
}

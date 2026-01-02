//! Tauri commands exposed to the frontend

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtensionInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub author: Option<String>,
    pub path: String,
}

/// Get list of loaded extensions by scanning the extensions directory
#[tauri::command]
pub fn get_extensions(handle: tauri::AppHandle) -> Result<Vec<ExtensionInfo>, String> {
    let mut extensions = Vec::new();
    
    // In a real app, this would be in a resource directory or app data config
    // For development, we look at the relative 'extensions' folder
    let mut ext_dir = handle.path().resource_dir().unwrap_or_else(|_| PathBuf::from("."));
    
    // In dev mode, Resource Dir might be deep in target/debug
    // We try to find the 'extensions' folder by walking up or checking common locations
    if !ext_dir.join("extensions").exists() {
        // Try current working directory
        if let Ok(cwd) = std::env::current_dir() {
            if cwd.join("extensions").exists() {
                ext_dir = cwd;
            } else if cwd.parent().map(|p| p.join("extensions").exists()).unwrap_or(false) {
                // If we're in src-tauri, the parent has extensions
                ext_dir = cwd.parent().unwrap().to_path_buf();
            }
        }
    }
    
    let ext_path = ext_dir.join("extensions");
    
    if ext_path.exists() && ext_path.is_dir() {
        for entry in fs::read_dir(ext_path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();
            
            if path.is_dir() {
                let manifest_path = path.join("manifest.json");
                if manifest_path.exists() {
                    let manifest_content = fs::read_to_string(&manifest_path).map_err(|e| e.to_string())?;
                    if let Ok(mut info) = serde_json::from_str::<ExtensionInfo>(&manifest_content) {
                        info.path = path.to_string_lossy().to_string();
                        extensions.push(info);
                    }
                }
            }
        }
    }
    
    Ok(extensions)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppInfo {
    pub name: String,
    pub path: String,
    pub icon: Option<String>,
}

#[tauri::command]
pub fn get_apps() -> Vec<AppInfo> {
    scan_start_menu()
}

#[tauri::command]
pub fn toggle_devtools(window: tauri::WebviewWindow) {
    window.open_devtools();
}

#[cfg(target_os = "windows")]
fn scan_start_menu() -> Vec<AppInfo> {
    let mut apps = Vec::new();
    let start_menu_paths = vec![
        PathBuf::from("C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs"),
        dirs::home_dir().map(|h| h.join("AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs")).unwrap_or_default(),
    ];

    for path in start_menu_paths {
        if path.exists() {
            scan_dir_for_apps(&path, &mut apps);
        }
    }
    apps
}

#[cfg(not(target_os = "windows"))]
fn scan_start_menu() -> Vec<AppInfo> {
    Vec::new()
}

#[cfg(target_os = "windows")]
fn scan_dir_for_apps(dir: &PathBuf, apps: &mut Vec<AppInfo>) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                scan_dir_for_apps(&path, apps);
            } else if path.extension().and_then(|s| s.to_str()) == Some("lnk") {
                let name = path.file_stem().and_then(|s| s.to_str()).unwrap_or("Unknown").to_string();
                apps.push(AppInfo {
                    name,
                    path: path.to_string_lossy().to_string(),
                    icon: None,
                });
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

/// Search for files in the user's Documents folder
#[tauri::command]
pub fn search_files(query: String) -> Result<Vec<FileInfo>, String> {
    let mut files = Vec::new();
    
    if query.is_empty() {
        return Ok(files);
    }

    let search_root = dirs::document_dir().unwrap_or_else(|| dirs::home_dir().unwrap_or_default());
    
    if !search_root.exists() {
        return Ok(files);
    }

    walk_dir_for_files(&search_root, &query, &mut files, 0);

    Ok(files)
}

fn walk_dir_for_files(dir: &PathBuf, query: &str, files: &mut Vec<FileInfo>, depth: u32) {
    if depth > 2 { // Limit depth for performance
        return;
    }

    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = path.file_name().and_then(|s| s.to_str()).unwrap_or("");
            
            if name.to_lowercase().contains(&query.to_lowercase()) {
                files.push(FileInfo {
                    name: name.to_string(),
                    path: path.to_string_lossy().to_string(),
                    is_dir: path.is_dir(),
                });
            }

            if path.is_dir() && !name.starts_with('.') {
                walk_dir_for_files(&path, query, files, depth + 1);
            }

            if files.len() > 50 { // Limit results
                return;
            }
        }
    }
}

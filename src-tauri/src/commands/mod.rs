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

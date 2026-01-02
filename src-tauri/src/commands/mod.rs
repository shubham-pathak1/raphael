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
    
    // Handle the case where we are running in dev mode from the project root
    if !ext_dir.join("extensions").exists() {
        ext_dir = PathBuf::from(".");
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

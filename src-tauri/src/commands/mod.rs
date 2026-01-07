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
    #[serde(default)]
    pub path: String,
}

/// Get list of loaded extensions by scanning the extensions directory
#[tauri::command]
pub fn get_extensions(handle: tauri::AppHandle) -> Result<Vec<ExtensionInfo>, String> {
    let mut extensions = Vec::new();
    
    // Attempt to find extensions directory in multiple locations
    let mut search_paths = Vec::new();

    // 1. Resource directory
    if let Ok(res_dir) = handle.path().resource_dir() {
        search_paths.push(res_dir.join("extensions"));
    }

    // 2. Current working directory
    if let Ok(cwd) = std::env::current_dir() {
        search_paths.push(cwd.join("extensions"));
        // 3. Parent of CWD (if we are in src-tauri)
        if let Some(parent) = cwd.parent() {
            search_paths.push(parent.join("extensions"));
        }
    }
    
    let mut found_path = None;
    for path in &search_paths {
        if path.exists() && path.is_dir() {
            found_path = Some(path.clone());
            break;
        }
    }

    let ext_path = found_path.ok_or_else(|| {
        format!("Extensions directory not found. Searched in: {:?}", search_paths)
    })?;
    
    for entry in fs::read_dir(&ext_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        if path.is_dir() {
            let manifest_path = path.join("manifest.json");
            if manifest_path.exists() {
                let manifest_content = fs::read_to_string(&manifest_path).map_err(|e| e.to_string())?;
                match serde_json::from_str::<ExtensionInfo>(&manifest_content) {
                    Ok(mut info) => {
                        info.path = path.to_string_lossy().to_string();
                        extensions.push(info);
                    },
                    Err(_e) => {
                        // Log deserialization error in the response if needed, for now just skip
                        // return Err(format!("Failed to parse manifest at {:?}: {}", manifest_path, e));
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
    
    // Also scan Program Files for executables
    let program_files = vec![
        PathBuf::from("C:\\Program Files"),
        PathBuf::from("C:\\Program Files (x86)"),
    ];
    
    for path in program_files {
        if path.exists() {
            scan_for_exe_files(&path, &mut apps);
        }
    }
    
    // Remove duplicates by name
    apps.sort_by(|a, b| a.name.cmp(&b.name));
    apps.dedup_by(|a, b| a.name == b.name);
    
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
                let icon = extract_icon_from_lnk(&path);
                apps.push(AppInfo {
                    name,
                    path: path.to_string_lossy().to_string(),
                    icon,
                });
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn extract_icon_from_lnk(lnk_path: &PathBuf) -> Option<String> {
    use std::process::Command;
    
    // Use PowerShell to read shortcut properties
    let ps_command = format!(
        r#"$WshShell = New-Object -ComObject WScript.Shell; $shortcut = $WshShell.CreateShortcut('{}'); $shortcut.IconLocation"#,
        lnk_path.to_string_lossy().replace('\\', "\\\\")
    );
    
    if let Ok(output) = Command::new("powershell")
        .args(&["-NoProfile", "-Command", &ps_command])
        .output()
    {
        let icon_path = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !icon_path.is_empty() && icon_path != "0" {
            return Some(icon_path);
        }
    }
    
    None
}

#[cfg(target_os = "windows")]
fn scan_for_exe_files(dir: &PathBuf, apps: &mut Vec<AppInfo>) {
    use walkdir::WalkDir;
    
    let walker = WalkDir::new(dir);
    let mut found_count = 0;
    for entry in walker.into_iter().filter_map(|e| e.ok()) {
        if found_count > 500 { break; } // Limit the number of apps found
        
        let path = entry.path();
        
        // Only look at depth 2-3 to find main executables
        let depth = entry.depth();
        if depth < 2 || depth > 3 { continue; }
        
        if path.extension().and_then(|s| s.to_str()).map(|s| s.to_lowercase()) == Some("exe".to_string()) {
            // Skip system executables and installers
            let file_name = path.file_name().and_then(|s| s.to_str()).unwrap_or("");
            if file_name.to_lowercase().contains("uninstall") || 
               file_name.to_lowercase().contains("setup") ||
               file_name.to_lowercase().starts_with("_") {
                continue;
            }
            
            let name = path.file_stem().and_then(|s| s.to_str()).unwrap_or("Unknown").to_string();
            
            // Skip if app with this name already exists
            if !apps.iter().any(|a| a.name.to_lowercase() == name.to_lowercase()) {
                let icon = extract_icon_from_exe(&path);
                apps.push(AppInfo {
                    name,
                    path: path.to_string_lossy().to_string(),
                    icon,
                });
                found_count += 1;
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn extract_icon_from_exe(exe_path: &std::path::Path) -> Option<String> {
    // Return the exe path itself - Windows can render icons from exe files
    // The frontend can use file:// protocol to load the icon
    let path_str = exe_path.to_string_lossy().to_string();
    if !path_str.is_empty() {
        Some(format!("{}?icon", path_str))
    } else {
        None
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

use walkdir::{WalkDir, DirEntry};

/// Helper to determine if an entry should be skipped
fn is_hidden_or_system(entry: &DirEntry) -> bool {
    entry.file_name()
         .to_str()
         .map(|s| s.starts_with('.') || 
                  s == "node_modules" || 
                  s == "target" || 
                  s == "AppData" || 
                  s == "Windows" || 
                  s == "Program Files" || 
                  s == "Program Files (x86)" ||
                  s == "$Recycle.Bin" ||
                  s == "System Volume Information")
         .unwrap_or(false)
}

#[tauri::command]
pub fn search_files(query: String) -> Result<Vec<FileInfo>, String> {
    let mut files = Vec::new();
    if query.trim().is_empty() {
        return Ok(files);
    }

    let min_query_len = if query.chars().all(|c: char| c.is_numeric() || c.is_ascii_punctuation()) { 1 } else { 3 };
    if query.len() < min_query_len { return Ok(files); }

    let home_dir = dirs::home_dir().unwrap_or_default();
    let home_drive = home_dir.to_string_lossy().chars().next().unwrap_or('C').to_ascii_uppercase();

    // 1. Scan Home Directory (Recursive, up to depth 4 - sufficient for most user files)
    if home_dir.exists() {
        let walker = WalkDir::new(&home_dir)
            .max_depth(4)
            .into_iter()
            .filter_entry(|e| !is_hidden_or_system(e));

        for entry in walker.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() { continue; }
            
            if let Some(name) = path.file_name().and_then(|s| s.to_str()) {
                if name.to_lowercase().contains(&query.to_lowercase()) {
                    files.push(FileInfo {
                        name: name.to_string(),
                        path: path.to_string_lossy().to_string(),
                        is_dir: false,
                    });
                }
            }
            if files.len() >= 50 { break; }
        }
    }

    // 2. Scan other drives (Shallow depth 2 for speed)
    for letter in b'A'..=b'Z' {
        let char_letter = letter as char;
        if char_letter.to_ascii_uppercase() == home_drive { continue; }

        let drive = format!("{}:\\", char_letter);
        let drive_path = PathBuf::from(&drive);

        if drive_path.exists() {
             let walker = WalkDir::new(&drive_path)
                .max_depth(2) // Very shallow for fast root access
                .into_iter()
                .filter_entry(|e| !is_hidden_or_system(e));
            
            for entry in walker.filter_map(|e| e.ok()) {
                let path = entry.path();
                if path.is_dir() { continue; }

                if let Some(name) = path.file_name().and_then(|s| s.to_str()) {
                    if name.to_lowercase().contains(&query.to_lowercase()) {
                        files.push(FileInfo {
                            name: name.to_string(),
                            path: path.to_string_lossy().to_string(),
                            is_dir: false,
                        });
                    }
                }
                if files.len() >= 100 { break; }
            }
        }
    }

    Ok(files)
}

#[tauri::command]
pub fn open_item(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        
        // Use explorer to open the file/folder
        Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
            
        Ok(())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Custom open only implemented for Windows".to_string())
    }
}

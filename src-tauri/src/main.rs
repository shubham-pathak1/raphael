#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod extensions;
mod platform;

use tauri::Manager;
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
                    let toggle_shortcut = Shortcut::new(Some(Modifiers::ALT), Code::Space);
                    
                    if shortcut == &toggle_shortcut && event.state() == ShortcutState::Pressed {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, GlobalShortcutExt};
            let toggle_shortcut = Shortcut::new(Some(Modifiers::ALT), Code::Space);
            
            // Safety: Unregister all first to clear zombie states
            let _ = app.global_shortcut().unregister_all();
            
            if let Err(e) = app.global_shortcut().register(toggle_shortcut) {
                eprintln!("Warning: Failed to register global shortcut (Alt+Space): {}", e);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_extensions,
            commands::get_apps,
            commands::search_files,
            commands::toggle_devtools,
            commands::open_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

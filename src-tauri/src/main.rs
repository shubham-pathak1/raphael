#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod extensions;
mod platform;

use tauri::Manager;
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
            
            let toggle_shortcut = Shortcut::new(Some(Modifiers::ALT), Code::Space);
            app.handle().plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_handler(move |app, shortcut, event| {
                        if shortcut == &toggle_shortcut && event.state() == ShortcutState::Pressed {
                            let window = app.get_webview_window("main").unwrap();
                            if window.is_visible().unwrap_or(false) {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                        }
                    })
                    .build(),
            )?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_extensions,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

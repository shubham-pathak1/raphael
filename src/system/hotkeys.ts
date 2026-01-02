/**
 * Global Hotkey System
 * Handles global shortcuts for invoking the launcher
 */

// Placeholder for Tauri global shortcut integration
// Will use @tauri-apps/plugin-global-shortcut in production

export interface HotkeyConfig {
    modifiers: ("ctrl" | "alt" | "shift" | "super")[];
    key: string;
}

const DEFAULT_HOTKEY: HotkeyConfig = {
    modifiers: ["alt"],
    key: "Space",
};

export function getDefaultHotkey(): HotkeyConfig {
    return DEFAULT_HOTKEY;
}

export async function registerGlobalHotkey(
    config: HotkeyConfig,
    callback: () => void
): Promise<void> {
    // TODO: Implement with @tauri-apps/plugin-global-shortcut
    console.log("Global hotkey registration placeholder:", config);
    void callback;
}

export async function unregisterGlobalHotkey(): Promise<void> {
    // TODO: Implement cleanup
    console.log("Global hotkey unregistration placeholder");
}

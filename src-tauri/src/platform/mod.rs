//! Platform-specific implementations
//! Contains OS-specific code for Windows, macOS, and Linux

#[cfg(target_os = "windows")]
pub mod windows;

#[cfg(target_os = "macos")]
pub mod macos;

#[cfg(target_os = "linux")]
pub mod linux;

/// Get the current platform name
pub fn get_platform() -> &'static str {
    #[cfg(target_os = "windows")]
    return "windows";
    
    #[cfg(target_os = "macos")]
    return "macos";
    
    #[cfg(target_os = "linux")]
    return "linux";
    
    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    return "unknown";
}

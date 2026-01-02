//! Extension runtime and sandbox
//! Placeholder for extension system implementation

pub struct ExtensionRuntime {
    // Will hold loaded extensions and their state
}

impl ExtensionRuntime {
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for ExtensionRuntime {
    fn default() -> Self {
        Self::new()
    }
}

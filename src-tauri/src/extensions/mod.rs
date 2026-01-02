//! Extension runtime and sandbox
//! Placeholder for extension system implementation

#[allow(dead_code)]
pub struct ExtensionRuntime {
    // Will hold loaded extensions and their state
}

#[allow(dead_code)]
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

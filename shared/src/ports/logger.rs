pub trait Logger: Send + Sync {
    fn debug(&self, initiator: String, message: String);
    fn error(&self, initiator: String, message: String);
    fn info(&self, initiator: String, message: String);
    fn warning(&self, initiator: String, message: String);
    fn clone_box(&self) -> Box<dyn Logger + Send + Sync>;
}

impl Clone for Box<dyn Logger + Send + Sync> {
    fn clone(&self) -> Box<dyn Logger + Send + Sync> {
        self.clone_box()
    }
}

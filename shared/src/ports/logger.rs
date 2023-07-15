pub trait Logger {
    fn debug(&self, initiator: String, message: String);
    fn error(&self, initiator: String, message: String);
    fn info(&self, initiator: String, message: String);
    fn warning(&self, initiator: String, message: String);
}

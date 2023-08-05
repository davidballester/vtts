use super::super::ports::logger::Logger;
use log::debug;
use log::error;
use log::info;
use log::warn;

#[derive(Clone)]
pub struct EnvLogger {}

impl Logger for EnvLogger {
    fn debug(&self, initiator: String, message: String) {
        debug!("{}: {}", initiator, message);
    }

    fn error(&self, initiator: String, message: String) {
        error!("{}: {}", initiator, message);
    }

    fn info(&self, initiator: String, message: String) {
        info!("{}: {}", initiator, message);
    }

    fn warning(&self, initiator: String, message: String) {
        warn!("{}: {}", initiator, message);
    }

    fn clone_box(&self) -> Box<dyn Logger + Send + Sync> {
        Box::new((*self).clone())
    }
}

impl EnvLogger {
    pub fn new() -> Self {
        env_logger::init();
        EnvLogger {}
    }
}

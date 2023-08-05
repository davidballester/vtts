use crate::entities::user::User;
use crate::ports::users_repository::UsersRepository;
use shared::ports::logger::Logger;
use uuid::Uuid;

#[derive(Clone)]
pub struct UsersInteractor {
    repository: Box<dyn UsersRepository + Send + Sync>,
    logger: Box<dyn Logger + Send + Sync>,
}

impl UsersInteractor {
    pub fn new(
        repository: Box<dyn UsersRepository + Send + Sync>,
        logger: Box<dyn Logger + Send + Sync>,
    ) -> Self {
        UsersInteractor { repository, logger }
    }

    pub fn create(&self, user: User) -> Result<(), String> {
        self.logger.debug(
            "UsersInteractor.create".to_owned(),
            format!("Creating user: {:?}", user),
        );
        self.repository.create(user)
    }

    pub fn read(&self, id: Uuid) -> Result<Option<User>, String> {
        self.logger.debug(
            "UsersInteractor.read".to_owned(),
            format!("Reading user: {}", id),
        );
        self.repository.read(id)
    }

    pub fn read_by_email(&self, email: String) -> Result<Option<User>, String> {
        self.logger.debug(
            "UsersInteractor.read_by_email".to_owned(),
            format!("Reading user by email: {}", email),
        );
        self.repository.read_by_email(email)
    }

    pub fn update(&self, user: User) -> Result<(), String> {
        self.logger.debug(
            "UsersInteractor.update".to_owned(),
            format!("Updating user: {:?}", user),
        );
        self.repository.update(user)
    }

    pub fn delete(&self, id: Uuid) -> Result<(), String> {
        self.logger.debug(
            "UsersInteractor.delete".to_owned(),
            format!("Deleting user: {}", id),
        );
        self.repository.delete(id)
    }
}

use super::entities::user::User;
use ports::users_repository::UsersRepository;
use shared::ports::logger::Logger;

pub struct UsersInteractors {
    repository: Box<dyn UsersRepository>,
    logger: Box<dyn Logger>,
}

impl UsersInteractor {
    pub fn new(repository: Box<dyn UsersRepository>, logger: Box<dyn Logger>) -> Self {
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
        self.repository.read_by_id(id)
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
        self.repository.delete_by_id(id)
    }
}

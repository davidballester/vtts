use uuid::Uuid;

use super::super::entities::user::User;

pub trait UsersRepository: Send + Sync {
    fn create(&self, user: User) -> Result<(), String>;
    fn read(&self, id: Uuid) -> Result<Option<User>, String>;
    fn read_by_email(&self, email: String) -> Result<Option<User>, String>;
    fn update(&self, user: User) -> Result<(), String>;
    fn delete(&self, id: Uuid) -> Result<(), String>;
    fn clone_box(&self) -> Box<dyn UsersRepository + Send + Sync>;
}

impl Clone for Box<dyn UsersRepository + Send + Sync> {
    fn clone(&self) -> Box<dyn UsersRepository + Send + Sync> {
        self.clone_box()
    }
}

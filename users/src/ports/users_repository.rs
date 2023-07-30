use uuid::Uuid;

use super::super::entities::user::User;

pub trait UsersRepository {
    fn create(&self, user: User) -> Result<(), String>;
    fn read(&self, id: Uuid) -> Result<Option<User>, String>;
    fn read_by_email(&self, email: String) -> Result<Option<User>, String>;
    fn update(&self, user: User) -> Result<(), String>;
    fn delete(&self, id: Uuid) -> Result<(), String>;
}

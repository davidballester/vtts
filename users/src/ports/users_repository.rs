use super::entities::user::User;

pub trait UsersRepository {
    pub fn create(&self, user: User) -> Result<(), String>;
    pub fn read(&self, id: Uuid) -> Result<Option<User>, String>;
    pub fn read_by_email(&self, email: String) -> Result<Option<User>, String>;
    pub fn update(&self, user: User) -> Result<(), String>;
    pub fn delete(&self, id: Uuid) -> Result<(), String>;
}

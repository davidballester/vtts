use std::sync::{Arc, Mutex};

use super::super::entities::user::User;
use super::super::schema::users;
use crate::ports::users_repository::UsersRepository;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use uuid::Uuid;

#[derive(Debug, Queryable, Identifiable, Insertable, AsChangeset)]
#[diesel(table_name = users)]
pub struct DbUser {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl From<DbUser> for User {
    fn from(db_user: DbUser) -> Self {
        Self {
            id: db_user.id,
            name: db_user.name,
            email: db_user.email,
        }
    }
}

impl From<User> for DbUser {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: chrono::Utc::now().naive_utc(),
            updated_at: chrono::Utc::now().naive_utc(),
        }
    }
}

pub struct DieselUsersRepository {
    pub conn: Arc<Mutex<PooledConnection<ConnectionManager<diesel::PgConnection>>>>,
}

impl UsersRepository for DieselUsersRepository {
    fn create(&self, user: User) -> Result<(), String> {
        let db_user: DbUser = user.into();
        let mut conn = self.conn.lock().map_err(|err| err.to_string())?;
        diesel::insert_into(users::table)
            .values(&db_user)
            .execute(&mut *conn)
            .map_err(|err| err.to_string())?;
        Ok(())
    }

    fn read(&self, id: Uuid) -> Result<Option<User>, String> {
        let mut conn = self.conn.lock().map_err(|err| err.to_string())?;
        let result = users::table
            .filter(users::id.eq(id))
            .first::<DbUser>(&mut *conn)
            .optional()
            .map_err(|err| err.to_string())?;
        Ok(result.map(User::from))
    }

    fn read_by_email(&self, email: String) -> Result<Option<User>, String> {
        let mut conn = self.conn.lock().map_err(|err| err.to_string())?;
        let result = users::table
            .filter(users::email.eq(email))
            .first::<DbUser>(&mut *conn)
            .optional()
            .map_err(|err| err.to_string())?;
        Ok(result.map(User::from))
    }

    fn update(&self, user: User) -> Result<(), String> {
        let mut conn = self.conn.lock().map_err(|err| err.to_string())?;
        let db_user: DbUser = user.into();
        diesel::update(users::table.find(db_user.id))
            .set(&db_user)
            .execute(&mut *conn)
            .map_err(|err| err.to_string())?;
        Ok(())
    }

    fn delete(&self, id: Uuid) -> Result<(), String> {
        let mut conn = self.conn.lock().map_err(|err| err.to_string())?;
        diesel::delete(users::table.find(id))
            .execute(&mut *conn)
            .map_err(|err| err.to_string())?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
    use diesel::PgConnection;
    use dotenvy::dotenv;
    use serial_test::serial;
    use std::env;

    fn get_connection() -> Arc<Mutex<PooledConnection<ConnectionManager<diesel::PgConnection>>>> {
        dotenv().ok();
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<PgConnection>::new(database_url);
        let pool = Pool::builder()
            .build(manager)
            .expect("Failed to create pool.");
        let pooled_connection = pool.get().expect("Error getting connection from the pool.");
        Arc::new(Mutex::new(pooled_connection))
    }

    #[test]
    #[serial]
    fn test_create_user() {
        let conn = get_connection();
        let repo = DieselUsersRepository { conn };

        // Test data
        let user = User::new("Test User".into(), "test@example.com".into()).unwrap();

        // Call method
        let result = repo.create(user);

        // Verify
        assert!(result.is_ok());
    }

    #[test]
    #[serial]
    fn test_read_user() {
        let conn = get_connection();
        let repo = DieselUsersRepository { conn };
        let user = User::new("Test User".into(), "test@example.com".into()).unwrap();
        repo.create(user.clone())
            .map_err(|err| err.to_string())
            .unwrap();

        // Call method
        let result = repo.read(user.id);

        // Verify
        assert!(result.is_ok());
        assert_eq!(result.unwrap().unwrap().email, user.email);
    }

    #[test]
    #[serial]
    fn test_read_user_by_email() {
        let conn = get_connection();
        let repo = DieselUsersRepository { conn };
        let user = User::new("Test User".into(), "test@example.com".into()).unwrap();
        repo.create(user.clone())
            .map_err(|err| err.to_string())
            .unwrap();

        // Call method
        let result = repo.read_by_email(user.email.clone());

        // Verify
        assert!(result.is_ok());
        assert_eq!(result.unwrap().unwrap().email, user.email);
    }

    #[test]
    #[serial]
    fn test_update_user() {
        let conn = get_connection();
        let repo = DieselUsersRepository { conn };
        let mut user = User::new("Test User".into(), "test@example.com".into()).unwrap();
        repo.create(user.clone())
            .map_err(|err| err.to_string())
            .unwrap();

        // Update the user
        user.name = "Updated Name".to_string();
        // Call method
        let result = repo.update(user.clone());

        // Verify
        assert!(result.is_ok());

        // Check the user has been updated in the database
        let updated_user = repo.read(user.id).unwrap().unwrap();
        assert_eq!(updated_user.name, user.name);
    }

    #[test]
    #[serial]
    fn test_delete_user() {
        let conn = get_connection();
        let repo = DieselUsersRepository { conn };
        let user = User::new("Test User".into(), "test@example.com".into()).unwrap();
        repo.create(user.clone())
            .map_err(|err| err.to_string())
            .unwrap();

        // Call method
        let result = repo.delete(user.id);

        // Verify
        assert!(result.is_ok());

        // Check the user has been removed from the database
        let removed_user = repo.read(user.id).unwrap();
        assert!(removed_user.is_none());
    }
}

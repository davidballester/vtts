use lazy_static::lazy_static;
use regex::Regex;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

lazy_static! {
    static ref EMAIL_REGEX: Regex =
        Regex::new(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$").unwrap();
}

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: Uuid,
    name: String,
    email: String,
}

impl User {
    pub fn new(name: String, email: String) -> Result<Self, String> {
        if name.is_empty() || name.len() < 3 {
            return Err("Name should be non-empty and at least 3 characters long.".to_owned());
        }
        if !EMAIL_REGEX.is_match(&email) {
            return Err("Invalid email format.".to_owned());
        }
        let id = Uuid::new_v4();
        Ok(User { id, name, email })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_user_creation() {
        let name = String::from("John Doe");
        let email = String::from("john.doe@example.com");

        let user = User::new(name, email);
        assert!(user.is_ok());

        let user = user.unwrap();
        assert_eq!(user.name, "John Doe");
        assert_eq!(user.email, "john.doe@example.com");
    }

    #[test]
    fn test_invalid_user_name() {
        let name = String::from("");
        let email = String::from("john.doe@example.com");

        let user = User::new(name, email);
        assert!(user.is_err());
    }

    #[test]
    fn test_invalid_email() {
        let name = String::from("John Doe");
        let email = String::from("john.doe@example");

        let user = User::new(name, email);
        assert!(user.is_err());
    }
}

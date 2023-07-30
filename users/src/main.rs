mod entities {
    pub mod user;
}

mod ports {
    pub mod users_repository;
}

mod adapters {
    pub mod users_repository_psql;
}

pub mod schema;

fn main() {
    println!("Hello, world!");
}

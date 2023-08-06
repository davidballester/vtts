#[macro_use]
extern crate juniper;

use std::env;
use std::sync::{Arc, Mutex};

use adapters::gql_schema::{Context, Query, Schema};
use adapters::users_repository_psql::DieselUsersRepository;
use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use diesel::PgConnection;
use dotenvy::dotenv;
use interactors::users_interactor::UsersInteractor;
use juniper_warp::make_graphql_filter;
use ports::users_repository::UsersRepository;
use shared::adapters::env_logger::EnvLogger;
use shared::ports::logger::Logger;
use warp::Filter;

mod entities {
    pub mod user;
}

mod ports {
    pub mod users_repository;
}

mod adapters {
    pub mod gql_schema;
    pub mod users_repository_psql;
}

mod interactors {
    pub mod users_interactor;
}

pub mod schema;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let schema = get_juniper_schema();
    let context = get_juniper_context();
    let context = warp::any().map(move || context.clone()).boxed();
    let graphql_filter = make_graphql_filter(schema, context);
    println!("Listening on 127.0.0.1:80");

    warp::serve(warp::path("graphql").and(warp::post()).and(graphql_filter))
        .run(([127, 0, 0, 1], 80))
        .await;
}

fn get_juniper_schema() -> Schema {
    Schema::new(
        Query,
        juniper::EmptyMutation::<Context>::new(),
        juniper::EmptySubscription::<Context>::new(),
    )
}

fn get_juniper_context() -> Context {
    let users_interactor = get_users_interactor();
    Context { users_interactor }
}

fn get_users_repository() -> Box<dyn UsersRepository + Sync + Send> {
    let db_connection = get_db_connection();
    let diesel_users_repository = DieselUsersRepository {
        conn: db_connection,
    };
    Box::new(diesel_users_repository)
}

fn get_db_connection() -> Arc<Mutex<PooledConnection<ConnectionManager<diesel::PgConnection>>>> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");
    let pooled_connection = pool.get().expect("Error getting connection from the pool.");
    Arc::new(Mutex::new(pooled_connection))
}

fn get_users_interactor() -> UsersInteractor {
    let repository = get_users_repository();
    let logger = get_env_logger();
    UsersInteractor::new(repository, logger)
}

fn get_env_logger() -> Box<dyn Logger + Send + Sync> {
    let logger = EnvLogger {};
    Box::new(logger)
}

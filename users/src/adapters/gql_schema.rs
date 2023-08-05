use juniper::{EmptyMutation, EmptySubscription};

use crate::{entities::user::User, interactors::users_interactor::UsersInteractor};

#[derive(GraphQLObject)]
#[graphql()]
struct GqlUser {
    id: String,
    name: String,
    email: String,
}

impl From<User> for GqlUser {
    fn from(user: User) -> Self {
        Self {
            id: user.id.to_string(),
            name: user.name,
            email: user.email,
        }
    }
}

#[derive(Clone)]
pub struct Context {
    pub users_interactor: UsersInteractor,
}
impl juniper::Context for Context {}

pub struct Query;

#[juniper::graphql_object(
    Context = Context
)]
impl Query {
    fn api_version() -> &'static str {
        "0.1"
    }

    fn user(executor: &Executor, email: String) -> Option<GqlUser> {
        let context = executor.context();
        let users_interactor = &context.users_interactor;
        let user_result = users_interactor.read_by_email(email);
        match user_result {
            Ok(user) => user.map(|user| user.into()),
            Err(_) => None,
        }
    }
}

pub type Schema =
    juniper::RootNode<'static, Query, EmptyMutation<Context>, EmptySubscription<Context>>;

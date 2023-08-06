FROM rust:1-alpine3.17 as builder
WORKDIR /usr/src/vtts
COPY .. .
RUN cargo build --release -p users

FROM debian:bullseye-slim
COPY --from=builder /usr/src/vtts/target/release/users /usr/local/bin/users
CMD ["users"]
EXPOSE 80
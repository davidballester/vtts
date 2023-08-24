#!/bin/sh
gcloud auth activate-service-account --quiet --key-file=/tmp/service-account-key.json
export MONGO_INITDB_ROOT_USERNAME=$(gcloud secrets versions access latest --quiet --project=galvanic-smoke-396218 --secret=USERS_DATABASE_ROOT_USERNAME)
export MONGO_INITDB_ROOT_PASSWORD=$(gcloud secrets versions access latest --quiet --project=galvanic-smoke-396218 --secret=USERS_DATABASE_ROOT_PASSWORD)
echo "MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME" >> /tmp/.env
echo "MONGO_INITDB_ROOT_PASSWORD=\"$MONGO_INITDB_ROOT_PASSWORD\"" >> /tmp/.env

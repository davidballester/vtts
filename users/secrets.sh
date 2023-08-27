#!/bin/sh
gcloud auth activate-service-account --quiet --key-file=/tmp/service-account-key.json
export MONGO_USER=$(gcloud secrets versions access latest --quiet --project=galvanic-smoke-396218 --secret=USERS_DATABASE_ROOT_USERNAME)
export MONGO_PASS=$(gcloud secrets versions access latest --quiet --project=galvanic-smoke-396218 --secret=USERS_DATABASE_ROOT_PASSWORD)
echo "MONGO_USER=$MONGO_USER" >> /tmp/.env
echo "MONGO_PASS=\"$MONGO_PASS\"" >> /tmp/.env

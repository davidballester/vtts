# Users database

A MongoDB database for the [users](../users/README.md) web application.

## Notes

To authenticate `docker` to be able to push images to Google Cloud's artifact registry, I had to use this:

```
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://europe-west1-docker.pkg.dev
```

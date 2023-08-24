FROM gcr.io/google.com/cloudsdktool/cloud-sdk:427.0.0-alpine AS secrets
COPY ./.service-account-key.json /tmp/service-account-key.json
COPY ./secrets.sh /tmp/secrets.sh
RUN chmod +x /tmp/secrets.sh
RUN /tmp/secrets.sh

FROM mongo:7.0.0
COPY --from=secrets /tmp/.env /tmp/.env
RUN . /tmp/.env
EXPOSE 27017
CMD ["mongod"]

FROM gcr.io/google.com/cloudsdktool/cloud-sdk:427.0.0-alpine AS secrets
COPY ./.service-account-key.json /tmp/service-account-key.json
COPY ./secrets.sh /tmp/secrets.sh
RUN chmod +x /tmp/secrets.sh
RUN /tmp/secrets.sh

FROM node:18-alpine
WORKDIR /usr/src/app
COPY . .
COPY --from=secrets /tmp/.env .env
RUN npm ci
RUN npm run build
CMD ["npm", "run", "start:prod"]

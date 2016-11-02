#FROM node:6.4.0
FROM alpine:3.4

ARG CONTAINER_DIR

RUN apk update && apk add nodejs-lts && mkdir -p $CONTAINER_DIR && cd $CONTAINER_DIR
WORKDIR $CONTAINER_DIR

COPY . $CONTAINER_DIR

# RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]

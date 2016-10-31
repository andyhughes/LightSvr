#FROM nginx:1.11.1

FROM nginx:1.11.5-alpine

ARG CONTAINER_DIR
ARG PUBLIC_DIR

WORKDIR $CONTAINER_DIR/$PUBLIC_DIR

COPY public/* $CONTAINER_DIR/$PUBLIC_DIR

#RUN apt-get update && apt-get install -y git && cd /usr/share/nginx/html/ && git clone https://github.com/deliveryprinciples/LightSvr

# docker run --rm -it --name www -p 80:80 -v /Users/andrew/Code/LightSvr/website:/usr/share/nginx/html lightdf/testwww
# docker run --name www --rm -p 80:80 lightdf/testwww


NAME = nodeserver
VERSION = 0.1
DEVDIR = /Users/andrew/Code/LightSvr/nodeserver
CONTAINER_DIR = /usr/share/nodeserver
CONTAINER_NAME = LightSvr
CONTAINER_BIN_DIR = /usr/local/bin/node
PORT_EXPOSE = 3000
PORT_INTERNAL = 3000
NODESERVER_APP_NAME = app.js

.PHONY: build push shell run start stop rm release

build:
	docker build --build-arg CONTAINER_DIR=$(CONTAINER_DIR) -t $(NAME):$(VERSION) $(DEVDIR)

runDev:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT_INTERNAL):$(PORT_EXPOSE) -v $(DEVDIR):$(CONTAINER_DIR) $(NAME):$(VERSION) $(CONTAINER_BIN_DIR) $(CONTAINER_DIR)/$(NODESERVER_APP_NAME)

stopDev:
	docker stop $(CONTAINER_NAME)

startDev:
	docker start $(CONTAINER_NAME)

rmDev:
	docker rm $(CONTAINER_NAME)

rmImage:
	docker rmi $(NAME):$(VERSION)

run: runDev
stop: stopDev
start: startDev
rm: stop rmDev

default: runDev

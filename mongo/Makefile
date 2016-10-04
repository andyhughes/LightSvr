IMG_NAME = mongoserver
VERSION = 0.1
DEV_DIR = /Users/andrew/Code/LightSvr/mongo/
CONTAINER_DIR = /data
DATA_DIR = db
CONTAINER_NAME = mongoSvr
CONTAINER_BIN_DIR = /usr/bin
PORT_INTERNAL = 27017
PORT_EXPOSE = 27017

.PHONY: build push shell run start stop rm release

build:
	docker build -t $(IMG_NAME):$(VERSION) $(DEV_DIR)

runDev:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT_INTERNAL):$(PORT_EXPOSE) -v $(DEV_DIR)/$(DATA_DIR):$(CONTAINER_DIR)/$(DATA_DIR) $(IMG_NAME):$(VERSION)

runProd:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT_INTERNAL):$(PORT_EXPOSE) -v $(CONTAINER_DIR)/$(DATA_DIR):$(CONTAINER_DIR)/$(DATA_DIR) $(IMG_NAME):$(VERSION)

runCLI:
	docker exec -it $(CONTAINER_NAME) $(CONTAINER_BIN_DIR)/mongo

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

start:
	docker start $(CONTAINER_NAME)

restart: stop run

rm:
	docker rmi $(IMG_NAME):$(VERSION)

clean:
	docker images|grep \<none\>|awk '{print $$3}' | xargs docker rmi

run: runDev

bash:
	docker exec -it $(CONTAINER_NAME) /bin/bash

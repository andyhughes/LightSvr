IMG_NAME = mongoserver
VERSION = 0.1
DEV_DIR = /Users/andrew/Code/LightSvr/mongo/
CONTAINER_DIR = /data
DATA_DIR = db
CONTAINER_NAME = mongosvr
CONTAINER_BIN_DIR = /usr/bin
#PORT_INTERNAL = 27017
#PORT_EXPOSE = 27017### Do not expose a port to the world in production - should only be accessible inside the container infrasctructure... but this access is needed for test.
DOCKERHUB_UID = lightdf

.PHONY: build push shell run start stop rm release

build:
	docker build -t $(IMG_NAME):$(VERSION) $(DEV_DIR)

runDev:
	docker run -d --name $(CONTAINER_NAME) -v $(DEV_DIR)/$(DATA_DIR):$(CONTAINER_DIR)/$(DATA_DIR) $(IMG_NAME):$(VERSION)

runProd:
	docker run -d --name $(CONTAINER_NAME) -v $(CONTAINER_DIR)/$(DATA_DIR):$(CONTAINER_DIR)/$(DATA_DIR) $(IMG_NAME):$(VERSION)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

start:
	docker start $(CONTAINER_NAME)

restart: stop run

rm:
	-docker rmi $(IMG_NAME):$(VERSION)
	-docker rmi $(DOCKERHUB_UID)/$(CONTAINER_NAME):$(VERSION)

clean:
	-docker images|grep \<none\>|awk '{print $$3}' | xargs docker rmi

push:
	docker commit $(CONTAINER_NAME) $(DOCKERHUB_UID)/$(CONTAINER_NAME):$(VERSION)
	docker push $(DOCKERHUB_UID)/$(CONTAINER_NAME):$(VERSION)

run: runDev

shell:
	docker exec -it $(CONTAINER_NAME) /bin/bash

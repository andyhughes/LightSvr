.PHONY: build push shell run start stop rm release
default: build

IMG_NAME = nodeserver
VERSION = 0.1
DEV_DIR = /Users/andrew/Code/LightSvr/nodeserver
CONTAINER_DIR = /usr/share/nodeserver
CONTAINER_NAME = lightsvr
CONTAINER_BIN_DIR = /usr/bin
PORT_EXPOSE = 3000 ### Do not expose a port to the world in production - should only be accessible inside the container infrasctructure... but this access is needed for test.
PORT_INTERNAL = 3000
NODESERVER_APP_NAME = app.js
TEST_SCRIPT = test.js
JSHINT = /usr/local/bin/jshint
DOCKERHUB_UID = lightdf
TAG = 0.1
API_DOCS_DIR = api_docs

test_static:
	@echo "v---- Initiating static code test (using jshint, ES6) ----v"
	@$(JSHINT) --config .jshintrc *.js routes/*.js
	@if [ $$? -eq 0 ] ; then echo "Success: static test passed (jshint) - no errors" ; fi

test_dynamic:
	@echo "v---- Initiating dynamic node.js tests ----v"
	docker exec $(CONTAINER_NAME) $(CONTAINER_BIN_DIR)/node $(CONTAINER_DIR)/$(TEST_SCRIPT)

test: test_static test_dynamic

build: test_static
	@echo "v---- Building container ----v"
	docker build --build-arg CONTAINER_DIR=$(CONTAINER_DIR) -t $(IMG_NAME):$(VERSION) $(DEV_DIR)

runDev:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT_INTERNAL):$(PORT_EXPOSE) --link mongosvr:mongosvr -v $(DEV_DIR):$(CONTAINER_DIR) $(IMG_NAME):$(VERSION)

runProd:
	docker run -d --name $(CONTAINER_NAME) --link mongosvr:mongosvr $(IMG_NAME):$(VERSION)

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

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

push:
	docker commit $(CONTAINER_NAME) $(DOCKERHUB_UID)/$(CONTAINER_NAME):$(TAG)
	docker push $(DOCKERHUB_UID)/$(CONTAINER_NAME):$(TAG)

run: runDev

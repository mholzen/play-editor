host=ubuntu-1

# Development targets
run:
	npm start

push:
	rsync -avz --exclude .git --exclude node_modules -e ssh . marc@$(host):play-editor

.PHONY: build
build:
	npm run build

push-build:
	rsync -avz -e ssh build/ marc@$(host):play-go/public

ssh:
	ssh -A $(host) -l marc -t "cd play-editor; zsh --login --interactive"

remote-start:
	ssh -A $(host) -l marc "cd play-editor && npm start"

# Docker targets
.PHONY: build-docker
build-docker:
	docker buildx build --platform linux/amd64 -t play-editor --load .

.PHONY: run-docker
run-docker:
	docker run -p 3000:3000 --add-host=host.docker.internal:host-gateway play-editor

.PHONY: run-docker-remote
run-docker-remote:
	ssh marc@$(host) "docker run -p 3000:3000 --add-host=host.docker.internal:host-gateway ubuntu-1:5000/play-editor"

.PHONY: docker
docker: build-docker run-docker

.PHONY: push-docker
push-docker:
	docker tag play-editor $(host):5000/play-editor
	docker push $(host):5000/play-editor

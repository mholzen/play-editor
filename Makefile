host=ubuntu-1

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


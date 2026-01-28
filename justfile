host := "ubuntu-2"

run:
    npm start

test:
    npm test

push:
    rsync -avz --exclude .git --exclude node_modules -e ssh . marc@{{host}}:play-editor

build:
    npm run build

push-build:
    rsync -avz -e ssh build/ marc@{{host}}:play-go/public

ssh:
    ssh -A {{host}} -l marc -t "cd play-editor; zsh --login --interactive"

remote-start:
    ssh -A {{host}} -l marc "cd play-editor && npm start"


build-docker:
    docker buildx build --platform linux/amd64 -t play-editor --load .

run-docker:
    docker run -d --name play-editor -p 3000:3000 --add-host=host.docker.internal:host-gateway play-editor

run-docker-remote:
    ssh marc@{{host}} "docker pull {{host}}:5000/play-editor && docker run -p 80:3000 --add-host=host.docker.internal:host-gateway {{host}}:5000/play-editor"

docker: build-docker run-docker

push-docker:
    docker tag play-editor {{host}}:5000/play-editor
    docker push {{host}}:5000/play-editor

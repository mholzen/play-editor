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
    docker run -p 3000:3000 --add-host=host.docker.internal:host-gateway play-editor

run-docker-remote:
    ssh marc@{{host}} "docker pull {{host}}:5000/play-editor && docker run -p 80:3000 --add-host=host.docker.internal:host-gateway {{host}}:5000/play-editor"

docker: build-docker run-docker

push-docker:
    docker tag play-editor {{host}}:5000/play-editor
    docker push {{host}}:5000/play-editor

# Setup systemd user service and path watcher
systemd-setup:
    mkdir -p ~/.config/systemd/user
    cp config/systemd/play-editor.service ~/.config/systemd/user/
    cp config/systemd/play-editor.path ~/.config/systemd/user/
    systemctl --user daemon-reload
    systemctl --user enable play-editor.path
    systemctl --user enable play-editor.service
    systemctl --user start play-editor.path
    systemctl --user start play-editor.service
    @echo "Systemd service installed and started. Check status with: systemctl --user status play-editor.service"

# Stop and disable systemd service
systemd-teardown:
    systemctl --user stop play-editor.service
    systemctl --user stop play-editor.path
    systemctl --user disable play-editor.service
    systemctl --user disable play-editor.path
    rm -f ~/.config/systemd/user/play-editor.service
    rm -f ~/.config/systemd/user/play-editor.path
    systemctl --user daemon-reload
    @echo "Systemd service stopped and removed"

# Show systemd service status
systemd-status:
    systemctl --user status play-editor.service
    systemctl --user status play-editor.path

# Show systemd service logs
systemd-logs:
    journalctl --user -u play-editor.service -f



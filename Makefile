default:
	npm start

push:
	rsync -avz --exclude .git --exclude node_modules -e ssh . marc@ubuntu-1:play-editor


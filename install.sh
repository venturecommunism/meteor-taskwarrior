apt-get update && apt-get install -y git
wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | /bin/bash
[[ -s ~/.nvm/nvm.sh ]] && . ~/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10
nvm use 0.10
wget -q0- https://install.meteor.com | /bin/sh
git clone https://github.com/venturecommunism/meteor-taskwarrior.git

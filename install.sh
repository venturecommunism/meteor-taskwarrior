sudo apt-get update && sudo apt-get install -y git curl
curl https://raw.github.com/creationix/nvm/master/install.sh | /bin/bash
[[ -s ~/.nvm/nvm.sh ]] && . ~/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10
nvm use 0.10
curl https://install.meteor.com | /bin/sh
git clone https://github.com/venturecommunism/meteor-taskwarrior.git
cd meteor-taskwarrior

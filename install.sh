apt-get update && apt-get install -y git
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
[[ -s ~/.nvm/nvm.sh ]] && . ~/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10
nvm use 0.10
npm install -g meteorite
curl https://install.meteor.com | /bin/sh
git clone https://github.com/venturecommunism/meteor-taskwarrior.git
echo 'Log out and log back in for the mrt command to work'

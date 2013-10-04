### Install script

To install you could use the [install script](https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh) using cURL:

    curl https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

or Wget:

    wget -qO- https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

At this point you should log out and log back in so that the mrt command works.

Then do:

    cd meteor-taskwarrior

and then to run on port 80:

    mrt --port 80 &

or port 3000:

    mrt &

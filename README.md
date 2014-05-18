A [meteor](http://meteor.com) client for [task warrior](http://taskwarrior.com). Still in early development but you can sync your tasks to this client and see them in the browser including mobile.

### WARNING

This is Beta software. Expect your taskwarrior data to be lost and gone forever or otherwise corrupted until further notice.

### Requirements

You need to have your own [taskd server](http://taskwarrior.org/projects/taskwarrior/wiki/Server_setup) or an account on one. This has been tested on Ubuntu 12.04

### Install script

To install you could use the [install script](https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh) using cURL:

    curl https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

or Wget:

    wget -qO- https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

At this point you should log out and log back in so that the mrt command works.

Open up the [server/config.js](https://github.com/venturecommunism/meteor-taskwarrior/blob/master/server/config.js) file in an editor and edit the following values to match your task server configuration:

- taskserver (the ip or domain of your task server)
- port (defaults to 6544)
- org (org/group your task user belongs to)
- user (user name of your task user)
- key (shared key looks something like 'ddea9923-fgg3-3922-c958-23cgdeaa0584')

Then do:

    cd meteor-taskwarrior

and then to run on port 80:

    mrt --port 80 &

or port 3000:

    mrt &

When you click the Sync button you should see your tasks in the app. The changeset is stored in another collection. More coming.

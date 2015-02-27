A [meteor](http://meteor.com) client for [task warrior](http://taskwarrior.com). Still in early development but you can sync your tasks to this client and see them in the browser including mobile.

### Warning

This is beta software. Assume that using this software will break your taskwarrior data

### Requirements

To attempt to use the task warrior integration you'll have to use commit [4cdab380c63b801870885b69c398ebc339463c71](https://github.com/venturecommunism/meteor-taskwarrior/tree/4cdab380c63b801870885b69c398ebc339463c71)

If you want to test out the program as a stand-alone without task server integration, you can check out this version.

To use Task Warrior integration you need to have your own [taskd server](http://taskwarrior.org/projects/taskwarrior/wiki/Server_setup) or an account on one. This has been tested on Ubuntu 12.04

### Install script

To install you could use the [install script](https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh) using Wget:

    wget -qO- https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

or cURL:

    curl https://raw.github.com/venturecommunism/meteor-taskwarrior/master/install.sh | /bin/bash

Open up the [server/config.js](https://github.com/venturecommunism/meteor-taskwarrior/blob/master/server/config.js) file in an editor and edit the following values to match your task server configuration (the last time this file existed was [this commit](https://github.com/venturecommunism/meteor-taskwarrior/tree/4cdab380c63b801870885b69c398ebc339463c71)):

- taskserver (the ip or domain of your task server)
- port (defaults to 6544)
- org (org/group your task user belongs to)
- user (user name of your task user)
- key (shared key looks something like 'ddea9923-fgg3-3922-c958-23cgdeaa0584')

and then to run on port 80:

    meteor --port 80 &

or port 3000:

    meteor &

When you click the Sync button you should see your tasks in the app. The changeset is stored in another collection. More coming.

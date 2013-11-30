moblab
======

An Arduino+JohnnyFive based mobile device testing lab with browser proxying capabilities

requirements
============

moblab requires the following:

1) A Firmata compatible Arduino board (developed and tested using an Arduino Uno)

2) Servos (Standard, non-continuous rotation preferred)

running
=======

1) Install the project dependencies with npm:

```
$ npm install
```

2) Copy the `config.sample.json` file to `config.json`

3) Run the proxy with `node mob.proxy.js`

4) Configure your devices to use your IP address as a proxy, on port 8581

5) On a different terminal window, run the moblab controller with `node index.js`

proxy SSL
=========

We plan on adding on-demand certificate, [for now you can follow instructions here](https://github.com/joeferner/node-http-mitm-proxy).

available commands
==================

go("www.address.com")
---------------------

Navigates to www.address.com

reload();
---------

Reloads the current page

scrollTo(x,y);
--------------

Scrolls the current page to the given (x,y) coordinates

portrait();
-----------

Changes all the connected devices to portrait mode

landscape();
------------

Changes all the connected devices to landscape mode, turning them to the left

landscapeRight();
-----------------

Changes all the connected devices to landscape mode, turning them to the right

saveConfig();
-------------

Saves the current calibration values to `config.json`

You can change the calibration values like this:

```
>>> servo1.portrait = 90;
>>> servo1.landscape = 25;
>>> servo1.landscapeRight = 150;
>>> servo1.pin = 13;
```

servo[1-4].move(x);
-------------------

Moves the servo to the given position

servo[1-4].center();
--------------------

Resets the servo to the original position
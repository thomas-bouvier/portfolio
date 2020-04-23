---
title: "Auto-door"
description: "This little application written in React Native aims at remoting my parent's house garage door."
repository: https://github.com/thomas-bouvier/auto-door
---

# What's Auto-door?

The aim of this project was to control (open/close) my parents' motorized gate from an iPhone or an Android device. Using a Raspberry Pi, a relay and some magnetic sensors, I have managed to meet these requirements.

# What I did

Since the time I've been messing around with my Raspberry Pi, I have finally decided to use it in a concrete project. The electronic aspect is simple: relays make it possible to send a pulse to activate the system, and magnetic sensors make it possible to get the current state of the door.

I then designed the server using [Node.js](https://nodejs.org/en/") and [Socket.IO](https://socket.io/). This was the perfect opportunity to learn these modern technologies. To fully use JavaScript, I developed the application using [React Native](https://facebook.github.io/react-native/), so that it is compatible with both Android and iOS devices. I secured the application by adding session tokens. In the future, I would like to add push notifications.

The [repository](https://github.com/thomas-bouvier/auto-door) is hosted on Github. Feel free to adapt the code to your system!

# Usage

My family and myself are daily using the application. We particularly enjoy it, especially when we don't have our key with us. 👌

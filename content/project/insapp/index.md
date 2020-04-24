---
title: "Insapp"
description: "Insapp is an application promoting associations within INSA Rennes."
website: https://insapp.fr
repository: https://github.com/thomas-bouvier/insapp-android
---

# What's Insapp?

Insapp is a 2016 project. This application helps associations from [INSA Rennes](https://www.insa-rennes.fr) to easily communicate with students. Associations have access to a web app to post some news (just as Instagram) or events. Then, our users receive a push notification and get access to the content. There is also an iOS version.

{{< image src="images/insapp_1.png" >}}
{{< image src="images/insapp_2.png" >}}
{{< image src="images/insapp_3.png" >}}

Users can edit their profile, comment on news and events, tag friends, access the calendar of upcoming events, view an association's presentation page, or search all the content. Users can also scan their membership card to have the barcode directly in the application.

# What I did

I joined the team in October 2016 (there were then 2 people only). We decided to rewrite the Android application, the first version being unstable and not <em>material design</em>-friendly.

The Android client relied on [Retrofit](http://square.github.io/retrofit) as a HTTP client, [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) to send push notifications, [Glide](https://bumptech.github.io/glide) to load images and [Fabric](https://get.fabric.io) to monitor and understand crashes. This tool has allowed us to improve the stability and performance of the application over time. We also set up a whole development environment for Android. This project was the perfect opportunity to mess around with Kotlin. Gradually, we are converting the application into this language, which makes the code much more concise. Currently, about 50% of the lines are written in Kotlin. The [Android client repository](https://github.com/thomas-bouvier/insapp-android) is hosted on Github.

The backend is dockerized. This means that only one command is required to set up the database, API and administration interface. The user can then launch the configuration script to customize the installation. [Traefik](https://traefik.io/) is used as a reverse-proxy for the containers, and SSL certificates are generated automatically using [Let's Encrypt](https://letsencrypt.org/).

The technology used for the database is [MongoDB](https://www.mongodb.com/). This project was a good opportunity to try NoSQL.

The API is written in Golang and respects the REST architecture style. It sometimes requires evolutions (adding/modifying endpoints) according to the desired functionalities in the applications. A [multi-stage Docker build](https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds) is used to create a tiny Go image. You can find the [API repository](https://github.com/thomas-bouvier/insapp-go) on Github.

Finally, the administration interface, accessible to association managers to post content, is written in JavaScript, using ES6 and AngularJS.

This project has taught me a lot in the sense that it is technically transversal, but also because it involves communicating with students and taking team decisions.

# Usage

Insapp is available on the [App Store](https://apps.apple.com/fr/app/insapp/id1159630227) and [Play Store](https://play.google.com/store/apps/details?id=fr.insapp.insapp). Today, we count more than 500 active users, and about 200 hundred downloads on iOS and 1100 on Android. We worked with the school administration so they can also use the application. It's a large project in our school. Now, we try to pass our project to other students so they can innovate again and again on Insapp.

[Here](https://insapp.fr) is the official website. Sadly, the application is only accessible to people owning an internal account. 😖

{{< youtube GZnw1KQJRt8 >}}

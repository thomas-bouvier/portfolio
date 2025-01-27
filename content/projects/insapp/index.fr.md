+++
title = "Insapp"
date = 2017-08-28
description = "Insapp est une application de promotion des associations au sein de l'INSA Rennes."
[[resources]]
    text = "Site web archivé"
    link = "https://web.archive.org/web/20210123040047/https://insapp.fr/"
[[resources]]
    text = "Dépôt"
    link = "https://github.com/insapp-io"
tags = ["App", "Kotlin", "Go", "AngularJS"]
draft = false
+++

## Défi

Insapp est un projet de 2016. Cette application permet aux associations de l'[INSA Rennes](https://www.insa-rennes.fr) de communiquer facilement avec les étudiants. Les associations ont accès à une application web pour poster des nouvelles (tout comme Instagram) ou des événements. Ensuite, nos utilisateurs reçoivent une notification "push" et ont accès au contenu. Il existe également une version iOS.

{{< gallery "Client Android" >}}
  {{< image src="images/insapp_1.png" >}}
  {{< image src="images/insapp_2.png" >}}
  {{< image src="images/insapp_3.png" >}}
{{< /gallery >}}

Les utilisateurs peuvent modifier leur profil, commenter les actualités et les événements, marquer des amis, accéder au calendrier des événements à venir, consulter la page de présentation d'une association ou effectuer des recherches dans tout le contenu. Les utilisateurs peuvent également scanner leur carte de membre pour avoir le code-barres directement dans l'application.

## Ce que j'ai fait

J'ai rejoint l'équipe en octobre 2016 (il n'y avait alors que 2 personnes). Nous avons décidé de réécrire l'application Android, la première version étant instable et non <em>material design</em> friendly.

Le client Android s'appuyait sur [Retrofit](http://square.github.io/retrofit) comme client HTTP, [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) pour envoyer des notifications push, [Glide](https://bumptech.github.io/glide) pour charger des images et [Fabric](https://get.fabric.io) pour surveiller et comprendre les plantages. Cet outil nous a permis d'améliorer la stabilité et les performances de l'application au fil du temps. Nous avons également mis en place tout un environnement de développement pour Android. Ce projet était l'occasion idéale de s'amuser avec Kotlin. Progressivement, nous convertissons l'application dans ce langage, ce qui rend le code beaucoup plus concis. Actuellement, environ 50 % des lignes sont écrites en Kotlin. Le [dépôt client Android](https://github.com/thomas-bouvier/insapp-android) est hébergé sur Github.

Le backend est dockerisé. Cela signifie qu'une seule commande est nécessaire pour mettre en place la base de données, l'API et l'interface d'administration. L'utilisateur peut ensuite lancer le script de configuration pour personnaliser l'installation. [Traefik](https://traefik.io/) est utilisé comme un reverse-proxy pour les conteneurs, et les certificats SSL sont générés automatiquement en utilisant [Let's Encrypt](https://letsencrypt.org/).

La technologie utilisée pour la base de données est [MongoDB](https://www.mongodb.com/). Ce projet a été une bonne occasion d'essayer NoSQL.

L'API est écrite en Go et respecte le style de l'architecture REST. Elle nécessite parfois des évolutions (ajout/modification de terminaux) en fonction des fonctionnalités souhaitées dans les applications. Un [Docker build multi-étapes](https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds) est utilisé pour créer une petite image de Go. Vous pouvez trouver le [dépôt API](https://github.com/thomas-bouvier/insapp-go) sur Github.

Enfin, l'interface d'administration, accessible aux gestionnaires d'associations pour poster du contenu, est écrite en JavaScript, en utilisant ES6 et AngularJS.

Ce projet m'a beaucoup appris dans le sens où il est techniquement transversal, mais aussi parce qu'il implique de communiquer avec les étudiants et de prendre des décisions en équipe.

## Usage

Insapp est disponible sur l'[App Store](https://apps.apple.com/fr/app/insapp/id1159630227) et le [Play Store](https://play.google.com/store/apps/details?id=fr.insapp.insapp). Aujourd'hui, nous comptons plus de 500 utilisateurs actifs, et environ 200 centaines de téléchargements sur iOS et 1100 sur Android. Nous avons travaillé avec l'administration de l'école afin qu'elle puisse également utiliser l'application. C'est un grand projet dans notre école. Maintenant, nous essayons de transmettre notre projet aux autres élèves pour qu'ils puissent innover encore et encore sur Insapp.

[Ici](https://insapp.fr) est le site officiel. Malheureusement, l'application n'est accessible qu'aux personnes possédant un compte interne. 😖

{{< video f7PE5e9nMgg "Insapp launch teaser" >}}

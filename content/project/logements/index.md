---
title: "Logements INSA"
date: 2017-06-19
description: "This web application allows students from INSA Rennes to find accommodation around the campus."
repository: https://github.com/thomas-bouvier/logements-insa
tags: ["PHP", "Laravel"]
draft: true
---

# What's Logements INSA?

Logements INSA is a 2017 project. The student office contacted me to create a platform for students to easily find accommodation. Students can post and view apartment ads.

This was the opportunity for me to use [Laravel](https://laravel.com) in a real-life project.

{{< image "images/view_ad.png" "Viewing an apartment ad" >}}

# What I did

The platform should only be accessible to students from INSA. I then used this [project](https://github.com/subfission/cas) to force CAS authentication.

Students have then access to a form to write a new ad. They can attach multiple photos to it: uploads are handled with Ajax. They can still edit their ad after publication (adding or remove some photos for instance).

{{< image "images/write_ad.png" "Writing an apartment ad" >}}

I also developed an administration interface, allowing moderators to validate posted ads. They receive a mail when a new ad is posted.

As you can see above, I used [Bootstrap](http://getbootstrap.com) to build the UI. It is obviously fully responsive.

The [repository](https://github.com/thomas-bouvier/logements-insa) is hosted on Github. I'm currently working on implementing a search bar using [ElasticSearch](https://www.elastic.co) and [Elasicquent](https://github.com/elasticquent/Elasticquent).

# Usage

[Here](https://logements.insa-rennes.fr) is the official website. Sadly, the application is only accessible to people owning an internal account because of CAS. 😞

Some students have already found their new accommodation thanks to the platform ! 👌

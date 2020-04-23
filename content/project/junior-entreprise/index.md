---
title: "Junior entreprise websites"
description: "These showcase websites promote the junior enterprise movement."
website: https://ouest-insa.fr
repository: https://jer.bzh
---

# What are the junior entreprise websites?

I've been involved in [junior enterprise](https://junior-entreprises.com) for two years, starting in 2016. As a member of the IT division, I built 2 showcase websites to promote our movement.

A junior enterprise is a local non-profit organization entirely executed by students. Related to their field of studies the students offer services to the market; experiencing unique learning opportunities by doing professional project work on the one side and managing enterprises on the other. By doing this the students add practical experience to their theoretical skills and bridge the gap between academia and the business world.

The [first one](https://ouest-insa.fr) introduces our structure, Ouest INSA. The [second one](https://jer.bzh) introduces the <em>Junior-Entreprises Rennaises</em> movement, gathering 5 junior enterprises from Rennes (France).

# What I did

I used basic HTML/CSS along with [Bootstrap](https://getbootstrap.com). The websites are obviously fully responsive. They both include a customized map from [Google Maps API](https://developers.google.com/maps).
      
As the people in charge of these websites will change every year, they have to be easily maintenable. That's why I used [Docker](https://www.docker.com) to set up [nginx](http://nginx.org), PHP-FPM and [Composer](https://getcomposer.org). Dependencies like [PHPMailer](https://github.com/PHPMailer/PHPMailer) (used to send emails) can thus easily be added.

# Usage

New clients often discover the concept of junior entreprises through our website. If our offer suits them, they contact us through the form of request for quotation.

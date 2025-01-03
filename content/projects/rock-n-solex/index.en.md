+++
title = "Rock'n Solex website"
date = 2017-10-10
description = "This website presents Rock'n Solex, the oldest French student festival."
tags = ["HTML", "SASS"]
#thumbnail = "images/thumbnail.png"
draft = false
[[resources]]
    text = "Archived website"
    link = "https://web.archive.org/web/20180829044129/https://rocknsolex.fr/"
+++

## What's Rock'n Solex?

I've been involved in the Rock'n Solex 2018 team as a webmaster. The Rock'n Solex is the oldest student festival in France, first held in 1967. It combines Solex races during the day and music concerts every night. This is the major event in the school's associative life. It attracts more than 15,000 spectators over 3 days.

{{< video f_kzUJw-3aI "Aftermovie 2018" >}}

## What I've done

The graphic style of the website had to be consistent with the festival poster. I used [SASS](https://sass-lang.com) along with [Bootstrap](https://getbootstrap.com) to create it. The website is obviously fully responsive.

As the people in charge of the website change every year, it had to be easily maintenable. That's why I used [Docker](https://www.docker.com) to set up [nginx](http://nginx.org), PHP-FPM and [Composer](https://getcomposer.org). Dependencies like [PHPMailer](https://github.com/PHPMailer/PHPMailer) (used to send emails) can thus easily be added.

I also worked on the SEO. The first step was to unify the format of the links pointing to the website, as some included the prefix <em>www</em> or the extension <em>.php</em>. So I wrote redirections in an <em>.htaccess</em> file. Then, I made sure that the weight of the website was minimal, by avoiding integrating heavy Javascript libraries and compressing the images.

## Usage

The site recorded 100,000 visits during the 2017-2018 school year. During the week of the festival, 20,000 unique users logged in. The site gathers all the practical information of the event, the artist lineup, and news.

The graphic style changes at night! 🌙

# portfolio

This site is using the [Otomo theme](https://github.com/thomas-bouvier/gohugo-theme-otomo).

## Dev

### Clone the app

```bash
git clone https://github.com/thomas-bouvier/portfolio.git
```

The theme is attached to this project as a Hugo module (not a git submodule).

### Run the app

Launch the Hugo server in this directory:

```bash
hugo server
```

### Write content

Init `git-flow` inside the repository:

```bash
git flow init
```

Prefix features with `content/`.

Create a new post:

```bash
git flow feature start post_name
hugo new --kind post-bundle posts/post-name
git flow feature finish post_name
```

Create a new project:

```bash
git flow feature start project_name
hugo new --kind project-bundle projects/project-name
git flow feature finish project_name
```

### Theme development

https://www.hugofordevelopers.com/articles/master-hugo-modules-rapidly-develop-modules-locally/

### Local development

To edit the theme locally, add the following line to your `go.mod`. Make sure not to commit it :)

```
replace github.com/thomas-bouvier/gohugo-theme-otomo => ../gohugo-theme-otomo
```

### Theme bump

To bump the theme module, run the following command:

```
hugo mod get
```

## Deploy on a raspberry

### Install

```bash
wget https://go.dev/dl/go1.19.5.linux-armv6l.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.19.5.linux-armv6l.tar.gz
export PATH=$PATH:/usr/local/go/bin
go version
apt install hugo
```

### Serve

If you have a Gandi LiveDNS, place your API key in `~/.gandiapi`. Set up a cron job `crontab -e` to maintain the accuracy of your A `@` record using [this script](https://github.com/brianreumere/gandi-automatic-dns).

```bash
0,15,30,45 * * * * curl ipinfo.io/ip | /home/pi/gandi-automatic-dns/gad -5 -s -d thomas-bouvier.io -r "@"
```

Serve the app:

```bash
sudo systemctl start nginx
vi /etc/nginx/sites-available/thomas-bouvier.io
sudo chmod 0755 /var/www/thomas-bouvier.io
sudo chown pi:pi /var/www/thomas-bouvier.io
```

Base configuration:

```
server {
    listen 80;
    server_name thomas-bouvier.io;
    root /var/www/thomas-bouvier.io;
    index index.html;
}
```

Enable the site with `sudo ln -s /etc/nginx/sites-available/thomas-bouvier.io /etc/nginx/sites-enabled/`. Finally, set up SSL:

```console
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx
```

Renew the certificate using another cron job as root `sudo crontab -e`:

```bash
0 4 * * * certbot renew --post-hook "systemctl reload nginx"
```

## Deploy

```bash
git stash
hugo --minify
rsync -rzv -e ssh public/ pi@raspberrypi-site:/var/www/thomas-bouvier.io/ --delete-after
git stash apply
```

Don't forget to add the following files in `static` folder:

- `resume/resume_thomas_bouvier.pdf`
- `resume/cv_thomas_bouvier.pdf`
- `pgp_pub.asc`
- `papers/ccgrid24.pdf`
- `papers/phd24.pdf`
- `papers/fgcs25.pdf`

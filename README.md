# portfolio

This site is using the [Otomo theme](https://github.com/thomas-bouvier/gohugo-theme-otomo).

## Clone the app

```bash
git clone git@github.com:thomas-bouvier/portfolio.git
```

The theme is attached to this project as a Hugo module (not a git submodule).

## Run the app

Launch the Hugo server in this directory:

```bash
hugo server
```

## Write content

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

## Deploy

Deployments are automated with GitHub actions.

Don't forget to add `files/resume_thomas_bouvier.pdf` and `files/cv_thomas_bouvier.pdf` on the server.

## Theme development

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
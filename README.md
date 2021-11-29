# portfolio

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

gobuzzyourself
A buzzer system to play games in the current pandemic.
J. Adams
5/29/2020
------------------------------------------------------------------

This thing started as a buzzer system for the "Dirty Talk Game Show"
and expanded into a bit of a project.`

This application is setup for a multi-procfile deploy on heroku.
This is a mono repo that will deploy two apps. 

It uses yarn workspaces, so enabing experimental workspace support via:

   yarn config set workspaces-experimental true

...is required.

There are two workspaces stored in packages:
  gobuzzyourself-api/          gobuzzyourself-web/

Most of this is taken from:

https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile


ENV vars (set these on Heroku)
==============================

api app
-------
BUILD_ENV   web-client
PROCFILE    packages/gobuzzyourself-web/Procfile

web app
-------
BUILD_ENV   api
PROCFILE    packages/gobuzzyourself-api/Procfile

Buildpacks
===========

We need node first:
 
 heroku buildpacks:add --index 1 heroku/nodejs --app gobuzzyourself-api
 heroku buildpacks:add --index 1 heroku/nodejs --app gobuzzyourself-web

...and the multifile...

 heroku buildpacks:add -a gobuzzyourself-web https://github.com/heroku/heroku-buildpack-multi-procfile
 heroku buildpacks:add -a gobuzzyourself-api https://github.com/heroku/heroku-buildpack-multi-procfile

Deploy
=======

Have git remotes setup.

```
  heroku-api	https://git.heroku.com/gobuzzyourself-api.git (fetch)
  heroku-api	https://git.heroku.com/gobuzzyourself-api.git (push)
  heroku-web-client	https://git.heroku.com/gobuzzyourself-web.git (fetch)
  heroku-web-client	https://git.heroku.com/gobuzzyourself-web.git (push)
```

You do ths via:
```
  git remote add heroku-api https://git.heroku.com/gobuzzyourself-api.git
  git remote add heroku-web-client https://git.heroku.com/gobuzzyourself-web.git (fetch)
```
...then do:

```
   git push heroku-web-client master
   git push heroku-api master
```

Heroku should do the rest. 
gobuzzyourself

This application is setup for a multi-procfile deploy on heroku.

It uses yarn workspaces, so enabing experimental workspace support via:

   yarn config set workspaces-experimental true

...is required.

There are two workspaces stored in packages:

gobuzzyourself-api/          gobuzzyourself-web/

See also:
https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile

Deploy
=======

Have git remotes setup:

  heroku-api	https://git.heroku.com/gobuzzyourself-api.git (fetch)
  heroku-api	https://git.heroku.com/gobuzzyourself-api.git (push)
  heroku-web-client	https://git.heroku.com/gobuzzyourself-web.git (fetch)
  heroku-web-client	https://git.heroku.com/gobuzzyourself-web.git (push)

then do:

   git push heroku-web-client master
   git push heroku-api master


# Google docs Songbook addon

Source of the [Songbook Google addon](https://workspace.google.com/marketplace/app/songbook/591739870688)

For documentation see the plugin website [songbook.fusakla.cz](https://songbook.fusakla.cz).

For development use [`clasp`](https://github.com/google/clasp).

While developing use:
 - `make deps` install dependencies.
 - `make format` to format the source code.
 - `make develop` to continuously push changes to the Google project.


## How to release new version
> I always spent almost hour figuring this out... Google cloud console is one huge UX mess :fliptable:

 1. Commit all the changes and push them to master
 1. Run `make push`
 1. Run `make open`
 1. In upper right corner `Deploy` and `NewDeployment`, name it using semver compared to the previous deployments (the name actually doesn't mean anything i suppose :roolling_eyes: )
 1. Tag the git repo vith the same semver as `git tag v1.4.0 && git push origin v1.4.0`
 1. Go to `Deploy` and `Manage deployments`
 1. Choose the deployment you just created and scroll down to the `Library` -> `URL`, in the end of the URL is a number **which is the one important**
 1. Go to https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=gdosc-songbook and update the `Docs Add-on script version` to the number obtained in the previous step.

## See app errors
Go to https://console.cloud.google.com/errors?project=gdosc-songbook&authuser=0

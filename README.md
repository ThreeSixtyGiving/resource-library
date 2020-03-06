# Manually Deploy on Netlify

1 - After get loggin in Netlify click on __Deploys__ tab at navbar.
The information about your project will be displayed, like url, settings and deploys history.

2 - Make sure that all necessary changes are commited on github repository.

3 - Click on __Trigger Deploy__ button and select the option __Deploy Site__.
The Deploy`s log will be shown.

4 - Click on __Preview deploy__ to see the site on the web.

# Scheduled Deploy on Netlify using Github

This explains a simple way to schedule a task which deploy your app using github actions.

## Prerequisites

1. A text editor with support to yml
2. Access to Netlify console
3. Access to Github project repository

## How It Works

Github Actions provides customs workflows that we can automate some recurrent jobs. We`ll use actions to create a job to call a netlify hook that is responsible for start the deploy process.

## Setup

1 - To configure the action we need to create an yml file with the following lines:

```yml
name: Trigger Netlify Auto Build
on:
  schedule:
    - cron: '12 05 * * *' # every 05:12 AM
jobs:
  build:
    name: Request Netlify Webhook
    runs-on: ubuntu-latest
    steps:
      - name: Curl request
    run: curl -X POST -d '{}' https://api.netlify.com/build_hooks/<HOOK_ID>

```

`CRON`: It defines when to run the job.

`HOOK_ID`: It needs to be replaced by the hook id available on Netlify project. (Settings > Build & deploy > Continuous deployment > Build hooks).

2 - We need to create a folder inside the root directory in Github project `.github/workflows/<my_action.yml>`.

3 - Commit and Push and check the Netlify console received your changes.

For more details about Cron, yaml, Netlify Build Hooks and Github Actions check the docs bellow.

[Cron](https://crontab.guru/)

[Yaml](https://learn.getgrav.org/16/advanced/yaml)

[Github Actions](https://help.github.com/en/actions)

[Netlify Build Hooks](https://docs.netlify.com/configure-builds/build-hooks/)

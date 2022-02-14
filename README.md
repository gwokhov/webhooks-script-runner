# webhooks-script-runner

This program can help you to handle pushes of github webhooks and run the matching shell script to operate your project. 

## Usage

1. Make sure you deploy this program to your server.
1. `npm install pm2 -g` or `yarn global add pm2`
1. `npm install` or `yarn` to install dep.
1. Drop your script file (`<repoName>.sh`) to `./sh/<repoOwner>/`. (Check the demo of this repo).
1. Active the webhooks of your repo and fill the webhooks `url` of your server, select `application/json` as `Content type` and set your `Secret`.
1. run `npm run start PORT=<port> SECRET=<secret>`

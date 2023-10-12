# Webhook Receiver for OpenProject

The Webhook Receiver is a Node.js application designed to listen for merge request events from GitLab and create comments on relevant work packages in OpenProject.

## Prerequisites

Before running the application, ensure you have the following prerequisites:

- Node.js installed on your system. The version is determined in .nvmrc and in package.json
- Yarn package manager installed.
- GitLab access to receive webhook events.
- OpenProject API key to interact with the OpenProject API.

## Getting Started

To set up the application for local development and debugging, follow these steps:

1. Install [ngrok](https://ngrok.com/download) to expose your local IP address to GitLab for testing purposes. Once installed, run the following command in the ngrok package directory: `ngrok http <PORT>`, where `<PORT>` should match the port specified in the `index.js` file.

2. In the root directory of the webhook receiver project, run `yarn install` to install the required Node.js modules.

3. Create a `.env` file in the root directory of the project and add `OPEN_PROJECT_API_KEY=<your_api_key>` obtained from OpenProject.

4. To initiate the webhook listener, run the command `node index.js` or `yarn start`.

## Documentation

- Open Project API

  - (https://www.openproject.org/docs/api/endpoints/work-packages/)
  - (https://www.openproject.org/docs/api/endpoints/activities/)

- Gitlab Webhooks

  - https://docs.gitlab.com/ee/user/project/integrations/webhooks.html

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open a technical task in Open Project.

## Deployment
alias pushdeploy='git push -o ci.variable="DEPLOY=TRUE"'

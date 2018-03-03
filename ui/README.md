# ui

User interface for CrowdRev.
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Requirements

* Node.js 8+

## Configure

To run **ui** first you have to create the `config.json` configuration file. To do this, just copy the example file `src/config/config.json.example` and edit it.

```shell
$ cp src/config/config.json.example src/config/config.json
```

Make sure to remove all the comments. For development, just change the `server` property (http://localhost:4000 is ok) and set `clientId` (Google API Key). You can create a google api key [here](https://console.developers.google.com/projectselector/apis/credentials)

## Run

To run **ui** first install its dependencies:

```shell
$ npm install
```

### Development

To run in development mode, just issue the following:

```
$ npm start
```

Then open http://localhost:3000/ to see the application.

### Production

To generate a production build:

```
$ npm run build
```

To publish as a github page, you can just use the script include in the package.json file by running the following:

```
$ npm run deploy
```

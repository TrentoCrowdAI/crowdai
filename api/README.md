# api

Service + Business layer for CrowdRev. This project uses [koajs](http://koajs.com/) for the service layer. The business layer uses [Couchbase](https://www.couchbase.com/) as database.

## Requirements

* Node.js 8+
* Couchbase server (community version 5.0.1)

## Configure

To run **api** first you have to create the `.env` configuration file. To do this, just copy the example file `.env.example` and edit it.

```shell
$ cp .env.example .env
```

For development mode, you just have to change `GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID`. You can create a google api key [here](https://console.developers.google.com/projectselector/apis/credentials)

## Run

To run **api** first install its dependencies:

```shell
$ npm install
```

### Database

As mentioned before, CrowdRev uses Couchbase database. You can use docker to start couchbase server easily. If you don't have docker, go to the [docker community edition page](https://www.docker.com/community-edition) and follow the steps to install it in your platform. To start the couchbase server:

```
$ docker run -d --name db -p 8091-8094:8091-8094 -p 11210:11210 couchbase/server:community-5.0.1
```

##### Configure the database

After starting the database, you need to setup the cluster (server) and bucket (where we store our data) before using running the backend of CrowdRev. To initalize the cluster, follow the steps described [here](https://developer.couchbase.com/documentation/server/5.1/install/init-setup.html). To create a bucket, follow [these](https://developer.couchbase.com/documentation/server/5.1/clustersetup/create-bucket.html) steps (basically just set the name of the bucket, Couchbase as type and enable Flushing). Keep in mind that the database information should match with what you defined in your `.env` file.

##### Initialize the database

To run [queries](https://developer.couchbase.com/documentation/server/5.1/getting-started/try-a-query.html) in our database bucket, we first need to create [a primary index](https://developer.couchbase.com/documentation/server/5.1/sdk/n1ql-query.html#story-h2-8). To do this, run the following:

```
$ npm run db:init
```

Now you have the database up & running.

### Development

To run in development mode, just issue the following:

```
$ npm start
```

The API should be available at http://localhost:4000/

### Production

To deploy the backend in production using heroku, you can do the following:

Install _heroku-config_ to sync our configuration file:

```
$ heroku plugins:install heroku-config
```

Push configuration file to heroku. Notice that you can store production configs in a file named _.env.prod_.

```
$ heroku config:push -f .env.prod
```

Deploy the backend (you should run this from the root directory)

```
$ git subtree push --prefix api heroku master
```

The API should be available at https://[NAME].herokuapp.com

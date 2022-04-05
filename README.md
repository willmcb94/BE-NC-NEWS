# NC-News API Backend project

An API built giving access to various news articles
which can be sorted & filtered with queries. This project
is built with the intention to be used as the backend to
create our NC News websites.

## Getting started

Here is a link to the hosted version of the api -

https://will-nc-news.herokuapp.com

Please bear in mind the initial message you'll see is
{"msg":"path not found"}. This is because there is no valid
path yet. To get started add /api to the path and this will give you
a JSON object of all the available endpoints and their descriptions.

Alternatively to get the project running locally to allow development
and testing please continue below.

## Prerequisites

The below will be need to be installed globally on your machine.
| Dependency | Version |
| ---------- | ------- |
| PostgreSQL | 10.8 |
| Node.JS | v17.2.0 |
| NPM | 8.1.4 |

## Cloning and Installing

Please fork the project to your own Github profile and then go ahead
and clone the repo.

Once cloned in your terminal make your way to the directory where you wish to keep the repo and then
run this command -

```
$ git clone https://github.com/<your-github-username>/be-nc-news
```

Now we must install all dependencies please run the following command in your terminal.

```
$ npm install

```

This will install the following dependencies -

| Dependency    |
| ------------- |
| express       |
| Cors          |
| JEST          |
| jest-extended |
| jest-sorted   |
| supertest     |
| dotenv        |
| pg            |
| pg-format     |
| Husky         |

Now please run the following to get the databases setup -

```
$ npm run setup-dbs
$ npm run seed
```

You will need to create two .env files if you wish to clone this
repo and connect the databases: Please add PGDATABASE=nc_news_test
to .env.test and add PGDATABASE=nc_news to .env.development.
Please then check that these .env files are .gitignored.

Once completed the databases will be ready to go.
For example we can start by querying the test database.

Please run -

```
$ psql
\c nc_news_test
```

Then you can query the database as you wish for example -

```
nc_news_test=# SELECT * FROM articles;
```

To exit please type \q

## Now everything is setup

You can go ahead and explore the repo and make changes as you
choose. There is also a full test enviroment setup, feel free
to run these tests with the following command which will run the
full test suite -

```
$ npm test
```

Thank you and I hope you enjoy the repo!

William McBurney

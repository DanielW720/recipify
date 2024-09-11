# Recipify code repository

Recipify lets you search and upload food and drink recipes.

## Running locally

### The dataset

Food Ingredients and Recipes Dataset with Images: [kaggle.com](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images/data)

Download the zip and extract to `/backend/recipify/`. The directory is mounted to the `/app` directory of the web-app container service, which is useful when populating the database. It also enables auto-rebuilds when there are changes to the source code.

### Environment variables

The following .env files are expected:

- .env.postgres
  - Used by Docker Compose
  - Must include: POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD
- .env.web-api
  - Used by Docker Compose
  - Must include: DOCKER_ENV=True, DATABASE_URL
- .env.es
  - Used by Docker Compose
  - Must include: ELASTIC_USERNAME=elastic, ELASTIC_PASSWORD

_Only required when using Kibana:_

- .env.kibana (only required when using Kibana)
  - Used by Docker Compose
  - Must include: ELASTICSEARCH_USERNAME=kibana_system, ELASTICSEARCH_PASSWORD

_Only required when running the Django web API outside Docker:_

- backend/.env
  - Only used by Django when the Django project does _not_ run in a Docker container
  - Must include: DATABASE_URL

### Running all applications with Docker Compose

#### React frontend, Django backend, PostgreSQL and Elasticsearch

Setting the POSTGRES_USER and POSTGRES_DB variables when running `docker compose up` will remove related warnings and enable postgres healthchecks right away:

```
// run all apps except Kibana
docker compose --env-file .env.postgres up -d \
    web-api postgres elasticsearch
```

Populate the database by running the following command:

`docker exec -it web-api python manage.py import_from_csv ./data`

The `./data` argument is the relative path within the `/app` directory inside the web-api container.

#### Kibana

To start Kibana, some initial steps needs to be made.

```
// Set the following environment variables in the shell
export ELASTIC_PASSWORD="<ES_PASSWORD>" // password for "elastic" username
export KIBANA_PASSWORD="<KIB_PASSWORD>" // Used _internally_ by Kibana, must be at least 6 characters long

// Verify ES is running
curl elastic:$ELASTIC_PASSWORD http://localhost:9200

// Configure the Kibana password in the ES container
curl -u elastic:$ELASTIC_PASSWORD \
    -X POST \
    http://localhost:9200/_security/user/kibana_system/_password \
    -d '{"password":"'"$KIBANA_PASSWORD"'"}' \
    -H 'Content-Type: application/json'

// Start the Kibana container
docker compose up -d kibana
```

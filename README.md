# Recipify code repository

Recipify lets you search and upload food and drink recipes.

- [Recipify code repository](#recipify-code-repository)
  - [Running locally](#running-locally)
    - [The dataset](#the-dataset)
    - [The environment variables](#the-environment-variables)
    - [Running all applications with Docker Compose](#running-all-applications-with-docker-compose)
      - [React frontend, Django backend, PostgreSQL and Elasticsearch](#react-frontend-django-backend-postgresql-and-elasticsearch)
      - [Kibana](#kibana)
      - [Test search API in the shell](#test-search-api-in-the-shell)
  - [Development](#development)
    - [Rebuilding images](#rebuilding-images)
    - [Links](#links)

## Running locally

### The dataset

Food Ingredients and Recipes Dataset with Images: [kaggle.com](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images/data)

Download the zip and extract to `/backend/recipify/`. The directory is mounted to the `/app` directory of the web-app container service, which is useful when populating the database. It also enables auto-rebuilds when there are changes to the source code.

### The environment variables

The following .env files are expected:

- .env.postgres
  - Used by Docker Compose
  - Must include: POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD
- .env.web-api
  - Used by Docker Compose
  - Must include: DATABASE_URL, ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTICSEARCH_URL
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
  - Must include: DATABASE_URL, ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTICSEARCH_URL

### Running all applications with Docker Compose

#### React frontend, Django backend, PostgreSQL and Elasticsearch

Setting the POSTGRES_USER and POSTGRES_DB variables when running `docker compose up` will remove related warnings and enable postgres healthchecks right away:

```
// Run all apps except Kibana
docker compose --env-file .env.postgres up -d \
    web-api postgres elasticsearch
```

Populate the database by running the following command:

`docker exec -it web-api python manage.py import_from_csv ./data`

The `./data` argument is the relative path within the `/app` directory inside the web-api container.

Create and populate the Elasticsearch index:

`docker exec -it web-api python manage.py search_index --rebuild`

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

#### Test search API in the shell

Start a shell in the container:

`docker exec -it web-api python manage.py shell`

Test the search API:

```
>>> from recipify_search.documents import RecipeDocument
>>>
>>> s = RecipeDocument.search().query("match", title="potatoes")
>>>
>>> for hit in s:
...     print(f"Title: {hit.title}")
...
Title: Dill Potatoes
Title: Campfire Potatoes
Title: Mashed Potatoes
Title: Potatoes Rösti
Title: Scalloped Potatoes
Title: Roasted Sweet Potatoes, Potatoes, and Sage
Title: Salt-Roasted Potatoes
Title: Duchess Baked Potatoes
Title: Creamy Chive Potatoes
Title: Luxe French Potatoes
```

## Development

### Rebuilding images

Django web API image must be rebuilt sometimes, e.g. when adding new libraries to the python environments. Stop and delete the web-api container, then:

`docker compose build web-api && docker compose up -d web-api`

### Links

- Django Elasticsearch DSL docs: [readthedocs.io](https://django-elasticsearch-dsl.readthedocs.io/)
  - For indexing Django models in Elasticsearch
- Elasticsearch DSL docs: [readthedocs.io](https://elasticsearch-dsl.readthedocs.io/en/latest/)
  - Used by Django Elasticsearch DSL and as a high-level Elasticsearch client library which helps with writing and running queries against Elasticsearch

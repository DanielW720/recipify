# Recipify code repository

Recipify lets you search and upload food and drink recipes. 🍗

- [Recipify code repository](#recipify-code-repository)
  - [About this project](#about-this-project)
  - [Running locally](#running-locally)
    - [The dataset](#the-dataset)
    - [Environment variables](#environment-variables)
    - [Running all applications with Docker Compose](#running-all-applications-with-docker-compose)
      - [React, Django, PostgreSQL and Elasticsearch](#react-django-postgresql-and-elasticsearch)
      - [Django setup](#django-setup)
      - [Populate the PostgreSQL database and Elasticsearch index](#populate-the-postgresql-database-and-elasticsearch-index)
      - [Kibana (not required)](#kibana-not-required)
  - [Development](#development)
    - [Rebuilding images](#rebuilding-images)
    - [Vite setup](#vite-setup)
    - [Test search API in the shell](#test-search-api-in-the-shell)
    - [Test title vector embedding](#test-title-vector-embedding)
    - [Update the requirements.txt file](#update-the-requirementstxt-file)
    - [Links](#links)

## About this project

The project includes the following services:

- A Django REST API to interact with the database and search engine
- A Vite/React frontend application
- PostgreSQL database
- Elasticsearch and Kibana for search

## Running locally

### The dataset

Food Ingredients and Recipes Dataset with Images: [kaggle.com](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images/data)

Download the zip and extract to `/backend/recipify/data`, and name the csv file `data.csv`. The directory is mounted to the `/app` directory of the web-app container service, which is useful when populating the database. It also enables auto-rebuilds when there are changes to the source code.

### Environment variables

The following .env files are expected:

- .env.postgres
  - Used by Docker Compose
  - Must include: POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD
- .env.web-api
  - Used by Docker Compose
  - Must include: DATABASE_URL (format: postgres://\<username>:\<password>@\<hostname>:\<port>/\<database_name>), ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTICSEARCH_URL
- .env.elasticsearch
  - Used by Docker Compose
  - Must include: ELASTIC_USERNAME=elastic, ELASTIC_PASSWORD
- backend/.env
  - Only used by Django when the Django project does _not_ run in a Docker container
  - Needed for initial migration
  - Must include: DATABASE_URL, ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTICSEARCH_URL

_Only required when using Kibana:_

- .env.kibana (only required when using Kibana)
  - Used by Docker Compose
  - Must include: ELASTICSEARCH_USERNAME=kibana_system, ELASTICSEARCH_PASSWORD

### Running all applications with Docker Compose

#### React, Django, PostgreSQL and Elasticsearch

If using WSL2, grant permission for Elasticsearch to use the es_data volume: `sudo chown -R 1000:1000 ./es_data`

Setting the POSTGRES_USER and POSTGRES_DB variables when running `docker compose up` will remove related warnings and enable postgres healthchecks right away:

```
// Run all apps except Kibana
docker compose --env-file .env.postgres up -d \
    web-app web-api postgres elasticsearch
```

#### Django setup

To run django commands from outside Docker, the Django environment needs to be set up locally. Alternatively, manage.py commands can be run from the web-api container with "docker exec -it web-api python [COMMAND]".

1. Create a virtual environment: `python -m venv .venv_recipify`
2. Activate: `source ./.venv_recipify/bin/activate` (`source ./.venv_recipify/Scripts/activate` on bash for Windows)
3. `cd` into backend directory and install dependencies: `pip install -r requirements.txt`
4. `cd` into backend/recipify and perform initial migration: `python manage.py migrate`
5. Create a superuser: `python manage.py createsuperuser`

#### Populate the PostgreSQL database and Elasticsearch index

Create the ES index first so that it gets set up correctly before adding data:

`docker exec -it web-api python manage.py search_index --rebuild`

Now populate the database by running the following command:

`docker exec -it web-api python manage.py import_from_csv ./data`

The `./data` argument is the relative path within the `/app` directory inside the web-api container, so it does not matter what directory your in when running the command. The Elasticsearch index will be synced automatically.

#### Kibana (not required)

To start Kibana, some initial steps needs to be made. If using WSL2, grant permission to its volume: `sudo chown -R 1000:1000 ./kibana_data`

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

## Development

### Rebuilding images

Django web API image must be rebuilt sometimes, e.g. when adding new libraries to the python environments. To rebuild and run the web-api service, run:

`docker compose up -d web-api --build`

### Vite setup

The Vite app can be run with Docker compose without first installing packages locally. However the editor will not be happy about it when src files are opened.

```
cd frontend/recipify/
rm -rf node_modules
npm install
```

If using WSL2, file system watching does not work when a file is edited by Windows apps. It is recommended to use WSL2 applications to edit files. When using VS Code, this can be done with the WSL extension.

It is also possible to set `usePolling: true` in [vite.config.ts](/frontend/recipify/vite.config.ts) but it may lead to high CPU utilization.

### Test search API in the shell

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

### Test title vector embedding

Start a shell in the container:

`docker exec -it web-api python manage.py shell`

```
>>> from recipify_core.models import Recipe
>>>
>>> obj = Recipe.objects.get(pk='666')
>>> obj.__str__()
'666: Miso-Butter Roast Chicken With Acorn Squash Panzanella'
>>>
>>> obj.title_embedding()
array([-2.98841652e-02,  3.66088413e-02, -7.71749839e-02,  5.98382279e-02,
       -1.63089763e-02, -2.77271681e-02,  7.48105571e-02, -3.65380533e-02,
        .
        .
        .
        6.67738318e-02,  4.46503051e-03,  7.35084862e-02,  1.49704758e-02,
        6.07997703e-04, -4.69589569e-02,  4.06818325e-03,  5.78198582e-02],
      dtype=float32)
```

### Update the requirements.txt file

`pip freeze > requirements.txt`

### Links

- Django Elasticsearch DSL docs: [readthedocs.io](https://django-elasticsearch-dsl.readthedocs.io/)
  - For indexing Django models in Elasticsearch
- Elasticsearch DSL docs: [readthedocs.io](https://elasticsearch-dsl.readthedocs.io/en/latest/)
  - Used by Django Elasticsearch DSL and as a high-level Elasticsearch client library which helps with writing and running queries against Elasticsearch
- Python Elasticsearch Client: [readthedocs.io](https://elasticsearch-py.readthedocs.io/en/v8.16.0/)
  - Official low-level client for Elasticsearch. Elasticsearch DSL builds on top of this.

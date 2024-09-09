# Recipify code repository

Recipify lets you search and upload food and drink recipes.

## Running locally

### Environment files

The following .env files are expected:

- /.env.postgres
  - Used by docker-compose
  - Must include: POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD
- /.env.web-api
  - Used by docker-compose
  - Must include: DOCKER_ENV=True, DATABASE_URL
- /backend/.env (not necessary)
  - Only used by Django when the Django project does _not_ run in a Docker container
  - Must include: DATABASE_URL

### The dataset

Food Ingredients and Recipes Dataset with Images: [kaggle.com](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images/data)

Download the zip and extract to `/backend/recipify/`. The directory is mounted to the `/app` directory of the web-app container service, which is useful when populating the database. It also enables auto-rebuilds when there are changes to the source code.

### Running all applications with Docker Compose

Docker Compose makes it simple to run all applications. Setting the POSTGRES_USER and POSTGRES_DB variables when running `docker compose up` will remove related warnings and enable postgres healthchecks right away:

`docker compose --env-file .env.postgres up -d`

Populate the database by running the following command:

`docker exec -it web-api python manage.py import_from_csv ./data`.

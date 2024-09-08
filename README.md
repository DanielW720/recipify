# Recipify code repository

Recipify lets you search and upload food and drink recipes.

## Running locally

The docker-compose file makes it simple to run all applications, including auto-updating whenever code changes are made. Setting the POSTGRES_USER and POSTGRES_DB variables when running `docker compose up` will remove related warnings and enable postgres healthchecks right away:

`docker compose --env-file .env.postgres up -d`

Food Ingredients and Recipes Dataset with Images: [kaggle.com](https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images/data)

Download and place in `/backend/recipify/`. The data directory is mounted to the `/app/data` directory of the web-app container service. Populate the database by running the following command:

`docker exec -it web-api python manage.py import_from_csv ./data`.

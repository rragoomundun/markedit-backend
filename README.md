# Markedit Backend.

Backend for Markedit: the simple markdown note taking app.

## Usage

Rename file **config.env** to **.env** and update the values.

### .env example

```
# Port to use
PORT=5000


# Maximum number of requests per minute (only used in prod mode)
RATE_LIMIT=100


# The database name
DB_DATABASE=

# The database user's name
DB_USER=

# The password for the user of the database
DB_PASSWORD=

# The database host
DB_HOST=

# The database port
DB_PORT=
```

## Migrations

Rename **migrations/config/config.example.json** to **migrations/config/config.json** and update the values.

### config.json example

```
{
  "development": {
    "username": "developmentuser",
    "password": "developmentpassword",
    "database": "developmentdatabase",
    "host": "developmenthost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  },
  "test": {
    "username": "testuser",
    "password": "testpassword",
    "database": "testdatabase",
    "host": "testhost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  },
  "production": {
    "username": "productionuser",
    "password": "productionpassword",
    "database": "productiondatabase",
    "host": "productionhost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  }
}
```

### Commands

```
# Create a new migration called migration-name
npm run migration:create -- --name migration-name

# Apply the migration
npm run migration:migrate

# Cancel the migration
npm run migration:rollback
```

## Run API

```
# Run in development mode
npm run dev

# Run in production mode
npm run prod
```

## Generate documentation

```
npm run gendoc
```

- Version: 0.2.0
- License: MIT
- Author: Raphael Ragoomundun

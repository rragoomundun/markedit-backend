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


# AWS API Access Key
AWS_ACCESS_KEY_ID=accesskeyid

# AWS API Secret Access Key
AWS_SECRET_ACCESS_KEY=secretaccesskey

# AWS S3 Upload Bucket Region
AWS_S3_REGION=s3region

# AWS S3 bucket name
AWS_S3_BUCKET_NAME=

# AWS SES region
AWS_SES_REGION=sesregion


# From email name
FROM_NAME=Markedit

# From email address
FROM_EMAIL=noreply@ex.com

# Reply email address
REPLY_EMAIL=contact@ex.com


# The production front end URL
APP_PROD_URL=https://app.markedit.net

# The development front end URL
APP_DEV_URL=https://app-dev.markedit.net
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

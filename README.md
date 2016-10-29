# ESN-F16-SA2
SA2 team project repo (PLEASE DO NOT CREATE ANY PUBLIC REPO INSIDE CMUSV-FSE)

### Get Started

* Install mysql and make sure it works. Create a database from mysql:
```
CREATE DATABASE IF NOT EXISTS esn_db;
```

* Set some environment variables and dont forget to `source` it:
```
export DB_HOST="localhost"
export DB_NAME="esn_db"
export DB_USER="<your_user_name>"
export DB_PASSWORD="<your_db_password>"
```    

* Run this command to install all of dependencies
```
./scripts/preinstall.sh
npm install
./scripts/postinstall.sh
```

* Run the application by `npm start`


### Testing

Do the following action prior running the test:
```
CREATE DATABASE IF NOT EXISTS esn_db_test;
```

* To run the application in the test mode, do the following command : `NODE_ENV=test npm start`
* To run the test in the local mode, use `npm test`

### Ground Rules

#### Adding new database schema

If you are writing a new schema, please use `db-migrate` to create a new migration script. The steps are described below:

* `db-migrate create <migration script name> --sql-file`
* Put the sql migration script into `<timestamp>-<migration script name>-up.sql` files
* Save it
* to run the migration script, simply call `db-migrate up`
* In case you want to roll it back, simply put the migration script for rolling back to `<timestamp>-<migration script name>-down.sql` and run `db-migrate down`.

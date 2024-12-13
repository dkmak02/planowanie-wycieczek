#!/bin/bash

# Dependencies installation
echo "Installing dependencies..."
if ! dpkg -l | grep -qw postgresql; then
  echo "PostgreSQL is not installed. Installing dependencies..."
  apt-get update && apt-get install -y \
    postgresql \
    postgresql-client
else
  echo "PostgreSQL is already installed. Skipping installation."
fi

# Check if PostgreSQL client is already installed
if ! dpkg -l | grep -qw postgresql-client; then
  echo "PostgreSQL client is not installed. Installing..."
  apt-get update && apt-get install -y postgresql-client
else
  echo "PostgreSQL client is already installed. Skipping installation."
fi

# Define paths and PostgreSQL credentials
OSM2PO_JAR="osm2po-core-5.5.11-signed.jar"
OSM_FILE="/osm_data/data.osm.pbf"  # Manually downloaded OSM file
TILE_SIZE="x"
PREFIX="hh"
SQL_FILE_PATH="/usr/src/app/hh/hh_2po_4pgr.sql"

# PostgreSQL environment variables
POSTGRES_HOST="trip-planner-db"  # PostgreSQL container name
POSTGRES_USER="tripplanner"
POSTGRES_PASSWORD="yourpassword"
POSTGRES_DB="tripplanner_db"

# Check if the OSM file exists
if [ ! -f "$OSM_FILE" ]; then
  echo "Error: OSM file ($OSM_FILE) not found. Please ensure it exists."
  exit 1
fi

# Run osm2po
echo "Running osm2po with the manually downloaded OSM file..."
java -Xmx1g -jar $OSM2PO_JAR prefix=$PREFIX tileSize=$TILE_SIZE $OSM_FILE postp.0.class=de.cm.osm2po.plugins.postp.PgRoutingWriter &

# Wait for osm2po to finish generating the SQL file
echo "Waiting for osm2po to generate the SQL file..."
while [ ! -f $SQL_FILE_PATH ]; do
  echo "SQL file not found. Waiting..."
  sleep 15
done
echo "SQL file generated successfully."

# Importing OSM data into PostgreSQL
echo "Importing OSM data into PostgreSQL..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "5432" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$SQL_FILE_PATH"

# Check if the import was successful
if [ $? -eq 0 ]; then
  echo "OSM data successfully imported into PostgreSQL."
else
  echo "Error: Failed to import OSM data into PostgreSQL."
  exit 1
fi

# Dockerfile for PostgreSQL with PostGIS and pgRouting
FROM postgres:16.0

# Install PostGIS and pgRouting extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-16-postgis-3 \
    postgresql-16-postgis-3-scripts \
    postgresql-16-pgrouting && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the locale
RUN apt-get install -y --no-install-recommends locales && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for PostgreSQL
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Expose PostgreSQL port
EXPOSE 5432

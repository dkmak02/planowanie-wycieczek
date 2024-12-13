# Use an OpenJDK base image with Java
FROM openjdk:8-jre-slim

# Set the working directory
WORKDIR /usr/src/app

# Install necessary utilities and dependencies
RUN apt-get update && \
    apt-get install -y wget curl unzip bash dos2unix && \
    apt-get clean

# Download osm2po zip file
RUN wget http://osm2po.de/releases/osm2po-5.5.11.zip -O osm2po-5.5.11.zip

# Unzip osm2po and clean up the zip file
RUN unzip -o osm2po-5.5.11.zip && \
    rm osm2po-5.5.11.zip

# List the files to confirm osm2po-core is in the right location
RUN ls -l /usr/src/app

# Create directories for data and sql scripts
RUN mkdir -p /osm_data && mkdir -p /usr/src/app/hh

# Expose the port for web service (if needed)
EXPOSE 8889

# Copy the .sh script into the container
COPY osm2po.sh /usr/src/app/osm2po.sh

# Ensure the script has Unix line endings and is executable
RUN dos2unix /usr/src/app/osm2po.sh && chmod +x /usr/src/app/osm2po.sh

# Set the default command to run the script
CMD ["/usr/src/app/osm2po.sh"]

FROM openjdk:8-jre-slim


WORKDIR /usr/src/app


RUN apt-get update && \
    apt-get install -y wget curl unzip bash dos2unix && \
    apt-get clean


RUN wget http://osm2po.de/releases/osm2po-5.5.11.zip -O osm2po-5.5.11.zip


RUN unzip -o osm2po-5.5.11.zip && \
    rm osm2po-5.5.11.zip


RUN ls -l /usr/src/app


RUN mkdir -p /osm_data && mkdir -p /usr/src/app/hh


EXPOSE 8889

COPY osm2po.sh /usr/src/app/osm2po.sh

RUN dos2unix /usr/src/app/osm2po.sh && chmod +x /usr/src/app/osm2po.sh

CMD ["/usr/src/app/osm2po.sh"]

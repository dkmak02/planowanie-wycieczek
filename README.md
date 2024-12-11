# Planowanie Wycieczek

---

## ⚠️ Important

Obecnie dostępne są jedynie punkty znajdujące się na terenie województwa opolskiego.  
(Możliwość zaimportowania innych danych ręcznie opisana jest w punkcie 3 instrukcji uruchomienia)

---

## Spis Treści

1. [Używane technologie](#używane-technologie)
2. [Baza danych](#baza-danych)
3. [Dokumentacja dla HTTP API](#dokumentacja-dla-http-api)
   - [Online](#online)
   - [Local](#local)
4. [Flowchart](#flowchart)
5. [Wymagania](#requirements)
6. [Uruchomienie](#uruchomienie)

---

## Używane technologie

- **Frontend**: React.js, JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Baza danych**: PostgreSQL, PostGIS, pgRouting
- **Zarządzanie kontenerami**: Docker, Docker Compose
- **Routing OSM**: osm2po (do przetwarzania danych OSM na dane do routingu)

---

## Baza danych

Projekt używa PostgreSQL z rozszerzeniami PostGIS i pgRouting. Dane OSM są importowane do bazy danych za pomocą narzędzia osm2po. Struktura bazy danych obejmuje tabele do przechowywania informacji o trasach i lokalizacjach, które są następnie używane do generowania planów wycieczek.

---

## Dokumentacja dla HTTP API

### Local

Jeśli chcesz uruchomić lokalną wersję dokumentacji API, uruchom aplikację i odwiedź:
[http://localhost:4000/docs](http://localhost:4000/docs)

Dokumentacja jest generowana automatycznie przy użyciu narzędzia `swagger` lub `apidoc`.

---

## Flowchart

Poniżej znajduje się diagram ilustrujący główny proces działania aplikacji:

![Flowchart](path_to_flowchart_image.png)

---

## Requirements

### Minimalne wymagania systemowe:

- **System operacyjny**: Linux, macOS, Windows
- **Java**: Wersja 8 lub nowsza (wymagane do uruchomienia `osm2po`)
- **Docker**: Wersja 19.03 lub nowsza
- **Docker Compose**: Wersja 1.25 lub nowsza

### Zainstalowane narzędzia:

- **Node.js**: Wersja 14.x lub nowsza
- **npm**: Wersja 6.x lub nowsza
- **PostgreSQL**: Wersja 12.x lub nowsza

---

## Uruchomienie

Aby uruchomić projekt, wykonaj następujące kroki:

### 1. Zainstaluj wymagane narzędzia:

- **Docker i Docker Compose**: 
  - Docker: [Instalacja Docker](https://www.docker.com/get-started)
  - Docker Compose: [Instalacja Docker Compose](https://docs.docker.com/compose/install/)
  
- **Java (wymagane do używania osm2po)**:
  - Java: [Pobierz Java JDK](https://adoptopenjdk.net/)
  
### 2. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/dkmak02/planowanie-wycieczek.git
   cd planowanie-wycieczek
   ```
### 3. Pobierania danych
  Pobierz plik w formacie .osm.pbf z Geofabrik, a następnie zmień jego nazwę na data.osm.pbf i umieść go w folderze osm_data.
### 4. Zbuduj obrazy Docker:
   ```bash
   docker-compose build
   ```
### 5. Uruchom kontenery:
   ```bash
   docker-compose up
   ```
### 6. Uruchom przeglądarke:
- **Otwórz przeglądarkę i przejdź pod adres:** 
  [http://localhost:3000](http://localhost:3000)
### 7. Zatrzymanie kontenerów:
   ```bash
   docker-compose down
   ```



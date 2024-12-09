# Planowanie Wycieczek

## Spis Treści

1. [Używane technologie](#używane-technologie)
2. [Baza danych](#baza-danych)
3. [Dokumentacja dla HTTP API](#dokumentacja-dla-http-api)
   - [Online](#online)
   - [Local](#local)
4. [Dokumentacja dla WebSockets](#dokumentacja-dla-websockets)
   - [Online](#online-1)
   - [Local](#local-1)
5. [Flowchart](#flowchart)
6. [Requirements](#requirements)
7. [Uruchomienie](#uruchomienie)

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

### Online

Dokumentacja API dla aplikacji dostępna jest pod adresem:
[http://localhost:5000/docs](http://localhost:5000/docs)

Dokumentacja ta zawiera szczegóły dotyczące dostępnych punktów końcowych (endpoints), metod HTTP oraz struktury odpowiedzi API.

### Local

Jeśli chcesz uruchomić lokalną wersję dokumentacji API, uruchom aplikację i odwiedź:
[http://localhost:5000/docs](http://localhost:5000/docs)

Dokumentacja jest generowana automatycznie przy użyciu narzędzia `swagger` lub `apidoc`.

---

## Dokumentacja dla WebSockets

### Online

WebSocket API dla aplikacji jest dostępne pod adresem:
[ws://localhost:5000/socket](ws://localhost:5000/socket)

Dzięki WebSocket, aplikacja umożliwia dwukierunkową komunikację w czasie rzeczywistym, na przykład do śledzenia zmian w czasie rzeczywistym lub komunikacji użytkowników.

### Local

Lokalnie WebSocket działa pod adresem:
[ws://localhost:5000/socket](ws://localhost:5000/socket)

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

1. **Zainstaluj wymagane narzędzia**:
   - Zainstaluj Docker i Docker Compose.
   - Zainstaluj Java, jeśli chcesz używać `osm2po`.

2. **Sklonuj repozytorium**:
   ```bash
   git clone https://github.com/dkmak02/planowanie-wycieczek.git
   cd planowanie-wycieczek

# Join – Frontend

Angular-Frontend für **Join**, ein Kanban-Board für Teams nach dem Vorbild von Trello.
Entstanden 2023 während meiner Ausbildung zum Entwickler bei der Developer Akademie.

Das zugehörige Backend (Django REST API) liegt hier:
[SilvioSchriefl/Join_Backend](https://github.com/SilvioSchriefl/Join_Backend)

## Funktionen

- **Board** mit Spalten für den Arbeitsstand; Aufgaben per Drag & Drop verschieben,
  auf dem Handy über ein eigenes „Verschieben nach“-Menü
- **Aufgaben anlegen** mit Beschreibung, Fälligkeitsdatum, Priorität, Kategorie,
  zugewiesenen Personen und Unteraufgaben
- **Übersicht** (Summary) mit den wichtigsten Zahlen zum Board
- **Kontakte** anlegen, bearbeiten und löschen
- **Konto:** Registrierung, Login, Gast-Login, Logout
- Geschützte Bereiche über einen Route Guard; ein HTTP-Interceptor hängt das Login-Token an
  jede Anfrage
- Hilfe-Seite, Impressum und Datenschutz
- Responsive für Desktop und Handy

Die Seite „Passwort vergessen“ ist als Oberfläche vorhanden, im Backend aber nicht angebunden.

## Technik

- Angular 16, TypeScript
- Angular Material und Angular CDK (Drag & Drop)
- RxJS, Angular Router, HttpClient mit Interceptor und Route Guard
- SASS

## Lokal starten

Voraussetzungen: Node.js und die Angular CLI (`npm install -g @angular/cli`).

```bash
git clone https://github.com/SilvioSchriefl/Join-Angular.git
cd Join-Angular
npm install
ng serve
```

Danach im Browser `http://localhost:4200/` öffnen.

Die Adresse des Backends steht in `src/app/enviroments/enviroments.ts`. Für ein lokal laufendes
Backend dort `http://127.0.0.1:8000/` eintragen.

## Ton -und Akkordwürfel

Würfel für Stammtöne, Chromatik, Akkorde der 1. Lage, CAGED Barré-Akkorde.

Dazu der Chaos-Würfel zum differenziellen Lernen: Er zieht zufällig eine von 28 Karten mit einer ungewohnten Bedingung (z. B. „Stehen statt Sitzen" oder „Blind spielen, und Kopf hoch"), unter der das Stück gespielt wird.

Online: https://zufall.marcscheidegger.ch/

## Technik

Reines HTML/CSS/JS mit jQuery (lokal, `jquery-3.3.1.min.js`) – es werden keine Dateien von fremden
Servern geladen. Bei Änderungen an `zufall.js`, `zufall.css` oder `marke.css` die Versionsnummer
`?v=N` in `index.html` erhöhen.

Gemeinsamer Auftritt mit [marcscheidegger.ch](https://marcscheidegger.ch): `marke.css` enthält
Kopfleiste (Navigation zwischen den Übe-Tools), Fusszeile und Markenfarben. Die Datei ist in allen
Übe-Tools identisch – Änderungen überall gleich übernehmen.

Die Akkorde der 1. Lage werden in `akkorde.js` als SVG gezeichnet (Griffe als Daten, z. B. C = `x32010`,
Grundton gelb) und lassen sich als PNG speichern, kopieren oder teilen – etwa für Notiz-Apps.
„Alle Akkorde“ zeigt die Übersicht und erstellt per Knopf ein A4-PDF (direkt im Browser, ohne Bibliothek).
Nach dem Würfeln lässt sich angeben, ob man den Griff gewusst hat; der Lernstand (Haken/Kreuz pro Akkord)
wird nur im Browser gespeichert (localStorage) und erscheint in der Übersicht. Gewusste Akkorde (Haken) kommen beim
Würfeln nicht mehr vor; nach einem Kreuz oder „Lernstand löschen“ sind sie wieder dabei.
Die CAGED-Formen werden in `caged.js` für jeden gewürfelten Akkord berechnet und im richtigen Bund gezeichnet:
Akkordtöne blau (Grundton mit Ring), zuschaltbar Pentatonik (hellblau) sowie Leitton (rot) und Gleitton (grün);
Moll wahlweise ab Moll-Grundton (1 b3 5) oder mit Dur-Zahlen (Grundton = 6). Die Einstellungen merkt sich der Browser.

## Licence

Dieses Werk ist lizenziert unter einer Creative Commons Namensnennung - Nicht-kommerziell - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz.
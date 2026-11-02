// =============================================================================
// Akkorde der 1. Lage als SVG-Griffdiagramme (statt Bilder)
// =============================================================================
// Jeder Akkord ist als Griff beschrieben, in der Reihenfolge der Saiten
// tief E – A – D – G – H – hoch e:
//   x = Saite nicht spielen, 0 = leere Saite, 1–4 = Bund
// barre = Barré: Bund und Saiten (Nummer 1 = hoch e … 6 = tief E)
// grund = Grundton als Tonklasse (0 = C, 2 = D, 4 = E, 5 = F, 7 = G, 9 = A, 11 = H)
// Die Diagramme zeigen die hohe e-Saite oben und den Sattel links –
// wie die bisherigen Griffbilder.

var AKKORDE = {
    "C":   { griff: "x32010", grund: 0 },
    "A":   { griff: "x02220", grund: 9 },
    "G":   { griff: "320003", grund: 7 },
    "E":   { griff: "022100", grund: 4 },
    "F":   { griff: "xx3211", grund: 5, barre: { bund: 1, von: 1, bis: 2 } },
    "D":   { griff: "xx0232", grund: 2 },
    "Am":  { griff: "x02210", grund: 9 },
    "Em":  { griff: "022000", grund: 4 },
    "Dm":  { griff: "xx0231", grund: 2 },
    "C7":  { griff: "x32310", grund: 0 },
    "A7":  { griff: "x02020", grund: 9 },
    "G7":  { griff: "320001", grund: 7 },
    "E7":  { griff: "020100", grund: 4 },
    "D7":  { griff: "xx0212", grund: 2 },
    "B7":  { griff: "x21202", grund: 11 },
    "Am7": { griff: "x02010", grund: 9 },
    "Em7": { griff: "020000", grund: 4 },
    "Dm7": { griff: "xx0211", grund: 2, barre: { bund: 1, von: 1, bis: 2 } },
    "Bm7": { griff: "x20202", grund: 11 }
};

// Tonhöhe der leeren Saiten (tief E … hoch e) als Tonklasse
var LEERE_SAITEN = [4, 9, 2, 7, 11, 4];

// Farben passend zu marcscheidegger.ch
var FARBE = {
    linie: "#0b1220",     // Nachtblau: Saiten, Bünde, Punkte, Schrift
    grund: "#f2b544",     // Gelb: Grundton
    leer:  "#5a6785",     // gedämpft: ×
    papier: "#ffffff"     // Hintergrund (auch beim Export)
};

// Erzeugt das SVG eines Akkords als Text.
function akkordSvg(name) {
    var a = AKKORDE[name];
    if (!a) return "";
    var B = 4;                              // Anzahl Bünde im Diagramm
    var x0 = 46, dx = 38;                   // Sattel und Bundabstand
    var y0 = 48, dy = 20;                   // oberste Saite (hoch e) und Saitenabstand
    var breite = x0 + B * dx + 16, hoehe = y0 + 5 * dy + 22;
    var teile = [];

    teile.push('<rect width="' + breite + '" height="' + hoehe + '" rx="14" fill="' + FARBE.papier + '"/>');
    teile.push('<text x="16" y="30" font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-size="22" font-weight="700" fill="' + FARBE.linie + '">' + name + '</text>');

    // Saiten (waagrecht) und Bünde (senkrecht), Sattel dick
    for (var s = 0; s < 6; s++) {
        var y = y0 + s * dy;
        teile.push('<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + B * dx) + '" y2="' + y + '" stroke="' + FARBE.linie + '" stroke-width="1.6"/>');
    }
    for (var b = 0; b <= B; b++) {
        var x = x0 + b * dx;
        teile.push('<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y0 + 5 * dy) + '" stroke="' + FARBE.linie + '" stroke-width="' + (b === 0 ? 6 : 1.6) + '"' + (b === 0 ? ' stroke-linecap="round"' : '') + '/>');
    }

    // Barré als abgerundeter Balken über mehrere Saiten
    if (a.barre) {
        var bx = x0 + (a.barre.bund - 0.5) * dx;
        var by1 = y0 + (a.barre.von - 1) * dy, by2 = y0 + (a.barre.bis - 1) * dy;
        teile.push('<rect x="' + (bx - 8) + '" y="' + (by1 - 8) + '" width="16" height="' + (by2 - by1 + 16) + '" rx="8" fill="' + FARBE.linie + '"/>');
    }

    // Punkte, leere Saiten (○) und nicht gespielte Saiten (×)
    // a.griff[0] ist tief E (unterste Linie), a.griff[5] hoch e (oberste Linie)
    for (var i = 0; i < 6; i++) {
        var zeichen = a.griff[i];
        var yy = y0 + (5 - i) * dy;
        if (zeichen === "x") {
            var mx = x0 - 22;
            teile.push('<path d="M' + (mx - 5) + ' ' + (yy - 5) + 'l10 10M' + (mx + 5) + ' ' + (yy - 5) + 'l-10 10" stroke="' + FARBE.leer + '" stroke-width="2" stroke-linecap="round"/>');
            continue;
        }
        var bund = parseInt(zeichen, 10);
        var istGrund = (LEERE_SAITEN[i] + bund) % 12 === a.grund;
        if (bund === 0) {
            teile.push('<circle cx="' + (x0 - 22) + '" cy="' + yy + '" r="6.5" fill="' + (istGrund ? FARBE.grund : FARBE.papier) + '" stroke="' + FARBE.linie + '" stroke-width="1.8"/>');
        } else if (!(a.barre && bund === a.barre.bund && (6 - i) >= a.barre.von && (6 - i) <= a.barre.bis) || istGrund) {
            teile.push('<circle cx="' + (x0 + (bund - 0.5) * dx) + '" cy="' + yy + '" r="8" fill="' + (istGrund ? FARBE.grund : FARBE.linie) + '" stroke="' + FARBE.linie + '" stroke-width="1.8"/>');
        }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' ' + hoehe + '" width="' + breite + '" height="' + hoehe + '" role="img" aria-label="Griffbild ' + name + '">' + teile.join("") + '</svg>';
}

// Wandelt ein Akkord-SVG in ein scharfes PNG (3-fache Auflösung) für Notiz-Apps.
function akkordPng(name, faktor) {
    faktor = faktor || 3;
    return new Promise(function (fertig, fehler) {
        var svg = akkordSvg(name);
        var bild = new Image();
        bild.onload = function () {
            var c = document.createElement("canvas");
            c.width = bild.width * faktor;
            c.height = bild.height * faktor;
            var g = c.getContext("2d");
            // Weisser Grund bis in die Ecken – sonst wären die runden Ecken in Notiz-Apps durchsichtig
            g.fillStyle = FARBE.papier;
            g.fillRect(0, 0, c.width, c.height);
            g.scale(faktor, faktor);
            g.drawImage(bild, 0, 0);
            c.toBlob(function (blob) { blob ? fertig(blob) : fehler(new Error("PNG fehlgeschlagen")); }, "image/png");
        };
        bild.onerror = fehler;
        bild.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
}

// Bild herunterladen, teilen (iPad/iPhone → Notiz-App) oder in die Zwischenablage kopieren
function akkordSpeichern(name) {
    akkordPng(name).then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Akkord-" + name + ".png";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
}
function akkordTeilenMoeglich() {
    return !!(navigator.canShare && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] }));
}
function akkordTeilen(name) {
    akkordPng(name).then(function (blob) {
        var datei = new File([blob], "Akkord-" + name + ".png", { type: "image/png" });
        return navigator.share({ files: [datei], title: "Akkord " + name });
    }).catch(function () { /* Teilen abgebrochen */ });
}
function akkordKopieren(name, knopf) {
    if (!navigator.clipboard || !window.ClipboardItem) { akkordSpeichern(name); return; }
    // Safari verlangt, dass das Bild als Promise übergeben wird
    navigator.clipboard.write([new ClipboardItem({ "image/png": akkordPng(name) })]).then(function () {
        if (knopf) { var t = knopf.textContent; knopf.textContent = "Kopiert ✓"; setTimeout(function () { knopf.textContent = t; }, 1500); }
    }).catch(function () { akkordSpeichern(name); });
}

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
function akkordPng(name, faktor, typ) {
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
            c.toBlob(function (blob) { blob ? fertig(blob) : fehler(new Error("Bild fehlgeschlagen")); }, typ || "image/png", 0.92);
        };
        bild.onerror = fehler;
        bild.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
}

// =============================================================================
// Alle Akkorde als PDF (A4) – direkt im Browser erzeugt, ohne fremde Bibliothek.
// Jedes Griffbild kommt als JPEG ins PDF (PDF kann JPEG direkt einbetten).
// =============================================================================
// Text für PDF-Strings: Sonderzeichen ( ) \ maskieren, Umlaute & Co. als WinAnsi-Oktalcode
function pdfText(text) {
    var winAnsi = { "ä": 228, "ö": 246, "ü": 252, "Ä": 196, "Ö": 214, "Ü": 220, "é": 233, "è": 232, "à": 224, "–": 150, "·": 183, "«": 171, "»": 187 };
    return String(text).replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7e]/g, function (z) {
        return winAnsi[z] ? "\\" + winAnsi[z].toString(8) : "?";
    });
}

// lernstand (optional): { "C": { ja: 3, nein: 1, zuletzt: "ja" }, … } – dann zeigt das PDF
// pro Akkord Haken/Kreuz und Zähler sowie eine Zusammenfassung unter dem Titel.
function akkordePdf(namen, lernstand) {
    namen = namen || Object.keys(AKKORDE);
    var mitStand = !!(lernstand && Object.keys(lernstand).length);
    return Promise.all(namen.map(function (n) {
        return akkordPng(n, 3, "image/jpeg").then(function (b) { return b.arrayBuffer(); });
    })).then(function (jpegs) {
        var enc = new TextEncoder();
        var teile = [], laenge = 0, offsets = [];
        function schreib(x) {
            var bytes = typeof x === "string" ? enc.encode(x) : new Uint8Array(x);
            teile.push(bytes); laenge += bytes.length;
        }
        function objekt(nr, kopf, strom) {
            offsets[nr] = laenge;
            schreib(nr + " 0 obj\n" + kopf + "\n");
            if (strom !== undefined) { schreib("stream\n"); schreib(strom); schreib("\nendstream\n"); }
            schreib("endobj\n");
        }

        // Seite A4 in Punkt (1/72 Zoll); 4 Spalten
        var W = 595.28, H = 841.89, rand = 40, spalten = 4, abstand = 12;
        var zelleB = (W - 2 * rand - (spalten - 1) * abstand) / spalten;
        var bildB = 214, bildH = 170;                       // Grösse des SVG
        var zelleH = zelleB * bildH / bildB;
        var oben = H - (mitStand ? 106 : 92);               // Platz für Titel (und Zusammenfassung)
        var textZeile = mitStand ? 14 : 0;                  // Platz unter jedem Bild für den Zähler

        var bilder = jpegs.map(function (jpeg, i) {
            return { nr: 6 + i, jpeg: jpeg, spalte: i % spalten, zeile: Math.floor(i / spalten) };
        });
        function text(groesse, x, y, t, grau) {
            return (grau ? "0.35 0.40 0.52 rg " : "0.04 0.07 0.13 rg ") +
                "BT /F1 " + groesse + " Tf " + x.toFixed(2) + " " + y.toFixed(2) + " Td (" + pdfText(t) + ") Tj ET\n";
        }
        var inhalt = text(20, rand, H - 58, mitStand ? "Akkorde der 1. Lage – Lernstand" : "Akkorde der 1. Lage") +
            text(9, rand, H - 74, "Grundton gelb – hohe e-Saite oben, Sattel links", true) +
            text(8, rand, 28, "zufall.marcscheidegger.ch – Marc Scheidegger – CC BY-NC-SA 4.0", true);
        if (mitStand) {
            var gewusst = 0, geuebt = 0;
            namen.forEach(function (n) { var e = lernstand[n]; if (e) { geuebt++; if (e.zuletzt === "ja") gewusst++; } });
            inhalt += text(10, rand, H - 90, "Stand " + new Date().toLocaleDateString("de-CH") + ": " + gewusst + " von " +
                namen.length + " Akkorden zuletzt gewusst · " + geuebt + " geübt");
        }
        bilder.forEach(function (b, i) {
            var x = rand + b.spalte * (zelleB + abstand);
            var y = oben - (b.zeile + 1) * zelleH - b.zeile * (abstand + textZeile);
            inhalt += "q " + zelleB.toFixed(2) + " 0 0 " + zelleH.toFixed(2) + " " + x.toFixed(2) + " " + y.toFixed(2) + " cm /Im" + b.nr + " Do Q\n";
            if (!mitStand) return;
            var e = lernstand[namen[i]];
            inhalt += text(8, x + 2, y - 10, e ? e.ja + "x gewusst · " + e.nein + "x nicht gewusst" : "noch nicht geübt", true);
            if (!e) return;
            // Haken (grün) oder Kreuz (rot) als Kreis oben rechts im Griffbild
            var cx = x + zelleB - 13, cy = y + zelleH - 13, r = 8, k = 0.5523 * r;
            var kreis = (cx + r) + " " + cy + " m " +
                (cx + r) + " " + (cy + k) + " " + (cx + k) + " " + (cy + r) + " " + cx + " " + (cy + r) + " c " +
                (cx - k) + " " + (cy + r) + " " + (cx - r) + " " + (cy + k) + " " + (cx - r) + " " + cy + " c " +
                (cx - r) + " " + (cy - k) + " " + (cx - k) + " " + (cy - r) + " " + cx + " " + (cy - r) + " c " +
                (cx + k) + " " + (cy - r) + " " + (cx + r) + " " + (cy - k) + " " + (cx + r) + " " + cy + " c f\n";
            if (e.zuletzt === "ja") {
                inhalt += "0.36 0.79 0.42 rg " + kreis + "0.04 0.07 0.13 RG 1.8 w 1 J 1 j " +
                    (cx - 4) + " " + cy + " m " + (cx - 1) + " " + (cy - 3) + " l " + (cx + 4) + " " + (cy + 3.5) + " l S\n";
            } else {
                inhalt += "0.85 0.15 0.17 rg " + kreis + "1 1 1 RG 1.8 w 1 J " +
                    (cx - 3) + " " + (cy - 3) + " m " + (cx + 3) + " " + (cy + 3) + " l " +
                    (cx - 3) + " " + (cy + 3) + " m " + (cx + 3) + " " + (cy - 3) + " l S\n";
            }
        });

        schreib("%PDF-1.4\n%âãÏÓ\n");
        objekt(1, "<< /Type /Catalog /Pages 2 0 R >>");
        objekt(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        var xobj = bilder.map(function (b) { return "/Im" + b.nr + " " + b.nr + " 0 R"; }).join(" ");
        objekt(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Contents 4 0 R " +
            "/Resources << /Font << /F1 5 0 R >> /XObject << " + xobj + " >> >> >>");
        objekt(4, "<< /Length " + enc.encode(inhalt).length + " >>", inhalt);
        objekt(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
        bilder.forEach(function (b) {
            objekt(b.nr, "<< /Type /XObject /Subtype /Image /Width " + (bildB * 3) + " /Height " + (bildH * 3) +
                " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + b.jpeg.byteLength + " >>", b.jpeg);
        });

        // Verzeichnis (xref) mit den Positionen aller Objekte
        var anzahl = 6 + bilder.length, xref = laenge;
        var x = "xref\n0 " + anzahl + "\n0000000000 65535 f \n";
        for (var i = 1; i < anzahl; i++) x += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
        schreib(x + "trailer\n<< /Size " + anzahl + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
        return new Blob(teile, { type: "application/pdf" });
    });
}

function akkordePdfHerunterladen(knopf, lernstand) {
    var text = knopf && knopf.textContent;
    var mitStand = !!(lernstand && Object.keys(lernstand).length);
    if (knopf) knopf.textContent = "PDF wird erstellt …";
    akkordePdf(null, lernstand).then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = mitStand ? "Akkorde-1-Lage-Lernstand.pdf" : "Akkorde-1-Lage.pdf";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    }).finally(function () { if (knopf) knopf.textContent = text; });
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
    // Kurze Rückmeldung im Knopf, danach wieder der ursprüngliche Text
    function melden(text) {
        if (!knopf) return;
        var alt = knopf.dataset.text || knopf.textContent;
        knopf.dataset.text = alt;
        knopf.textContent = text;
        setTimeout(function () { knopf.textContent = alt; }, 1800);
    }
    // Ohne Zugriff auf die Zwischenablage wird das Bild stattdessen heruntergeladen
    function ersatz() { akkordSpeichern(name); melden("Gespeichert ⬇"); }
    if (!navigator.clipboard || !window.ClipboardItem) { ersatz(); return; }
    // Safari verlangt, dass das Bild als Promise übergeben wird
    navigator.clipboard.write([new ClipboardItem({ "image/png": akkordPng(name) })])
        .then(function () { melden("Kopiert ✓"); })
        .catch(ersatz);
}

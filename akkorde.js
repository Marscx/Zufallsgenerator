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

// Farben wie in den Instrumentengrafiken (caged.marcscheidegger.ch), damit Würfel-Bilder
// und Instrumentengrafiken auf Arbeitsblättern gleich aussehen:
// Akkordtöne blau, Grundton blau mit dickem dunklem Ring.
var FARBE = {
    linie: "#0b1220",     // Nachtblau: Saiten, Bünde, Rand der Punkte, Schrift
    akk:   "#2f6fde",     // Blau: Akkordton
    grund: "#2f6fde",     // Blau: Grundton (mit dickem Ring)
    ring:  3,             // Randdicke Grundton (normale Punkte: 1.4)
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

    teile.push('<rect width="' + breite + '" height="' + hoehe + '" fill="' + FARBE.papier + '"/>');
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
        teile.push('<rect x="' + (bx - 8) + '" y="' + (by1 - 8) + '" width="16" height="' + (by2 - by1 + 16) + '" rx="8" fill="' + FARBE.akk + '" stroke="' + FARBE.linie + '" stroke-width="1.4"/>');
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
        // Leere Saite: kleiner Punkt links vom Sattel, gespielter Ton: Punkt im Bund –
        // beide blau wie in den Instrumentengrafiken, der Grundton mit dickem Ring
        var rand = 'stroke="' + FARBE.linie + '" stroke-width="' + (istGrund ? FARBE.ring : 1.4) + '"';
        if (bund === 0) {
            teile.push('<circle cx="' + (x0 - 22) + '" cy="' + yy + '" r="6.5" fill="' + (istGrund ? FARBE.grund : FARBE.akk) + '" ' + rand + '/>');
        } else if (!(a.barre && bund === a.barre.bund && (6 - i) >= a.barre.von && (6 - i) <= a.barre.bis) || istGrund) {
            teile.push('<circle cx="' + (x0 + (bund - 0.5) * dx) + '" cy="' + yy + '" r="8" fill="' + (istGrund ? FARBE.grund : FARBE.akk) + '" ' + rand + '/>');
        }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' ' + hoehe + '" width="' + breite + '" height="' + hoehe + '" role="img" aria-label="Griffbild ' + name + '">' + teile.join("") + '</svg>';
}

// Wandelt ein Akkord-SVG in ein scharfes PNG (3-fache Auflösung) für Notiz-Apps.
function akkordPng(name, faktor, typ) {
    return svgBild(akkordSvg(name), faktor, typ);
}
// Wandelt ein beliebiges SVG (Akkord, CAGED-Form …) in ein PNG oder JPEG.
function svgBild(svg, faktor, typ) {
    faktor = faktor || 3;
    return new Promise(function (fertig, fehler) {
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
// PDF (A4) aus Griffbildern – direkt im Browser erzeugt, ohne fremde Bibliothek.
// Jedes Bild kommt als JPEG ins PDF (PDF kann JPEG direkt einbetten).
// =============================================================================
// Text für PDF-Strings: Sonderzeichen ( ) \ maskieren, Umlaute & Co. als WinAnsi-Oktalcode
function pdfText(text) {
    var winAnsi = { "ä": 228, "ö": 246, "ü": 252, "Ä": 196, "Ö": 214, "Ü": 220, "é": 233, "è": 232, "à": 224, "–": 150, "·": 183, "«": 171, "»": 187 };
    return String(text).replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7e]/g, function (z) {
        return winAnsi[z] ? "\\" + winAnsi[z].toString(8) : "?";
    });
}

// Erstellt ein A4-PDF aus SVG-Diagrammen, auf einer oder mehreren Seiten.
//   opt.seiten     Liste von Seiten (sonst ist opt selbst die einzige Seite), je Seite:
//     svgs         Liste der SVG-Texte – jedes Bild behält sein eigenes Seitenverhältnis
//     spalten      Anzahl Spalten
//     titel, untertitel, zusatz (optionale dritte Zeile)
//     unterText    optionale Liste: kleiner Text unter jedem Bild
//     marken       optionale Liste: "ja" (Haken) / "nein" (Kreuz) / null oben rechts im Bild
function svgPdf(opt) {
    var seiten = opt.seiten || [opt];
    // Grösse eines SVG aus seinen Attributen width/height
    function groesse(svg) {
        var w = /width="([\d.]+)"/.exec(svg), h = /height="([\d.]+)"/.exec(svg);
        return { w: w ? parseFloat(w[1]) : 300, h: h ? parseFloat(h[1]) : 200 };
    }
    var alle = [];
    seiten.forEach(function (s) { s.svgs.forEach(function (svg) { alle.push(svg); }); });
    return Promise.all(alle.map(function (svg) {
        return svgBild(svg, 3, "image/jpeg").then(function (b) { return b.arrayBuffer(); });
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
        function text(groesse, x, y, t, grau) {
            return (grau ? "0.35 0.40 0.52 rg " : "0.04 0.07 0.13 rg ") +
                "BT /F1 " + groesse + " Tf " + x.toFixed(2) + " " + y.toFixed(2) + " Td (" + pdfText(t) + ") Tj ET\n";
        }

        // Seite A4 in Punkt (1/72 Zoll)
        var W = 595.28, H = 841.89, rand = 40, abstand = 12;
        // Objektnummern: 1 Katalog, 2 Seitenliste, 3 Schrift, dann je Seite: Seite + Inhalt, danach die Bilder
        var nrBild = 4 + 2 * seiten.length, bildNr = 0, bilder = [];
        var seitenDaten = seiten.map(function (s, si) {
            var spalten = s.spalten || 1;
            var zelleB = (W - 2 * rand - (spalten - 1) * abstand) / spalten;
            var oben = H - (s.zusatz ? 106 : 92);               // Platz für Titel (und Zusatzzeile)
            var textZeile = s.unterText ? 14 : 0;               // Platz unter jedem Bild für Text
            var inhalt = text(20, rand, H - 58, s.titel || "") +
                text(9, rand, H - 74, s.untertitel || "", true) +
                text(8, rand, 28, "zufall.marcscheidegger.ch – Marc Scheidegger – CC BY-NC-SA 4.0", true);
            if (s.zusatz) inhalt += text(10, rand, H - 90, s.zusatz);
            var namen = [], y0 = oben;
            for (var start = 0; start < s.svgs.length; start += spalten) {
                // eine Zeile: Höhe = höchstes Bild der Zeile
                var zeile = s.svgs.slice(start, start + spalten).map(groesse);
                var zeilenH = Math.max.apply(null, zeile.map(function (g) { return zelleB * g.h / g.w; }));
                zeile.forEach(function (g, j) {
                    var i = start + j, nr = nrBild + bildNr;
                    var bh = zelleB * g.h / g.w;
                    var x = rand + j * (zelleB + abstand), y = y0 - bh;
                    bilder.push({ nr: nr, jpeg: jpegs[bildNr], w: g.w, h: g.h });
                    namen.push("/Im" + nr + " " + nr + " 0 R");
                    bildNr++;
                    inhalt += "q " + zelleB.toFixed(2) + " 0 0 " + bh.toFixed(2) + " " + x.toFixed(2) + " " + y.toFixed(2) + " cm /Im" + nr + " Do Q\n";
                    if (s.unterText) inhalt += text(8, x + 2, y - 10, s.unterText[i], true);
                    var marke = s.marken && s.marken[i];
                    if (!marke) return;
                    // Haken (grün) oder Kreuz (rot) als Kreis oben rechts im Bild
                    var cx = x + zelleB - 13, cy = y + bh - 13, r = 8, k = 0.5523 * r;
                    var kreis = (cx + r) + " " + cy + " m " +
                        (cx + r) + " " + (cy + k) + " " + (cx + k) + " " + (cy + r) + " " + cx + " " + (cy + r) + " c " +
                        (cx - k) + " " + (cy + r) + " " + (cx - r) + " " + (cy + k) + " " + (cx - r) + " " + cy + " c " +
                        (cx - r) + " " + (cy - k) + " " + (cx - k) + " " + (cy - r) + " " + cx + " " + (cy - r) + " c " +
                        (cx + k) + " " + (cy - r) + " " + (cx + r) + " " + (cy - k) + " " + (cx + r) + " " + cy + " c f\n";
                    if (marke === "ja") {
                        inhalt += "0.36 0.79 0.42 rg " + kreis + "0.04 0.07 0.13 RG 1.8 w 1 J 1 j " +
                            (cx - 4) + " " + cy + " m " + (cx - 1) + " " + (cy - 3) + " l " + (cx + 4) + " " + (cy + 3.5) + " l S\n";
                    } else {
                        inhalt += "0.85 0.15 0.17 rg " + kreis + "1 1 1 RG 1.8 w 1 J " +
                            (cx - 3) + " " + (cy - 3) + " m " + (cx + 3) + " " + (cy + 3) + " l " +
                            (cx - 3) + " " + (cy + 3) + " m " + (cx + 3) + " " + (cy - 3) + " l S\n";
                    }
                });
                y0 -= zeilenH + abstand + textZeile;
            }
            return { seite: 4 + 2 * si, inhalt: 5 + 2 * si, text: inhalt, namen: namen };
        });

        schreib("%PDF-1.4\n%âãÏÓ\n");
        objekt(1, "<< /Type /Catalog /Pages 2 0 R >>");
        objekt(2, "<< /Type /Pages /Kids [" + seitenDaten.map(function (d) { return d.seite + " 0 R"; }).join(" ") + "] /Count " + seitenDaten.length + " >>");
        objekt(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
        seitenDaten.forEach(function (d) {
            objekt(d.seite, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Contents " + d.inhalt + " 0 R " +
                "/Resources << /Font << /F1 3 0 R >> /XObject << " + d.namen.join(" ") + " >> >> >>");
            objekt(d.inhalt, "<< /Length " + enc.encode(d.text).length + " >>", d.text);
        });
        bilder.forEach(function (b) {
            objekt(b.nr, "<< /Type /XObject /Subtype /Image /Width " + Math.round(b.w * 3) + " /Height " + Math.round(b.h * 3) +
                " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + b.jpeg.byteLength + " >>", b.jpeg);
        });

        // Verzeichnis (xref) mit den Positionen aller Objekte
        var anzahl = nrBild + bilder.length, xref = laenge;
        var x = "xref\n0 " + anzahl + "\n0000000000 65535 f \n";
        for (var i = 1; i < anzahl; i++) x += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
        schreib(x + "trailer\n<< /Size " + anzahl + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
        return new Blob(teile, { type: "application/pdf" });
    });
}

// PDF erzeugen und herunterladen; der Knopf zeigt solange "PDF wird erstellt …"
function pdfHerunterladen(erzeugen, dateiname, knopf) {
    var text = knopf && knopf.textContent;
    if (knopf) knopf.textContent = "PDF wird erstellt …";
    return erzeugen().then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = dateiname;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    }).finally(function () { if (knopf) knopf.textContent = text; });
}

// Akkorde der 1. Lage. lernstand (optional): { "C": { ja: 3, nein: 1, zuletzt: "ja" }, … } –
// dann zeigt das PDF pro Akkord Haken/Kreuz und Zähler sowie eine Zusammenfassung unter dem Titel.
function akkordePdf(namen, lernstand) {
    namen = namen || Object.keys(AKKORDE);
    var mitStand = !!(lernstand && Object.keys(lernstand).length);
    var opt = {
        svgs: namen.map(akkordSvg), breite: 214, hoehe: 170, spalten: 4,
        titel: mitStand ? "Akkorde der 1. Lage – Lernstand" : "Akkorde der 1. Lage",
        untertitel: "Grundton mit dickem Ring – hohe e-Saite oben, Sattel links"
    };
    if (mitStand) {
        var gewusst = 0, geuebt = 0;
        namen.forEach(function (n) { var e = lernstand[n]; if (e) { geuebt++; if (e.zuletzt === "ja") gewusst++; } });
        opt.zusatz = "Stand " + new Date().toLocaleDateString("de-CH") + ": " + gewusst + " von " +
            namen.length + " Akkorden zuletzt gewusst · " + geuebt + " geübt";
        opt.unterText = namen.map(function (n) {
            var e = lernstand[n];
            return e ? e.ja + "x gewusst · " + e.nein + "x nicht gewusst" : "noch nicht geübt";
        });
        opt.marken = namen.map(function (n) { return lernstand[n] ? lernstand[n].zuletzt : null; });
    }
    return svgPdf(opt);
}
function akkordePdfHerunterladen(knopf, lernstand) {
    var mitStand = !!(lernstand && Object.keys(lernstand).length);
    return pdfHerunterladen(function () { return akkordePdf(null, lernstand); },
        mitStand ? "Akkorde-1-Lage-Lernstand.pdf" : "Akkorde-1-Lage.pdf", knopf);
}

// Bild herunterladen, teilen (iPad/iPhone → Notiz-App) oder in die Zwischenablage kopieren.
// Die bild…-Funktionen arbeiten mit jedem SVG, die akkord…-Funktionen mit einem Akkordnamen.
function bildSpeichern(svg, dateiname) {
    svgBild(svg).then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = dateiname;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
}
function akkordTeilenMoeglich() {
    return !!(navigator.canShare && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] }));
}
function bildTeilen(svg, dateiname, titel) {
    svgBild(svg).then(function (blob) {
        var datei = new File([blob], dateiname, { type: "image/png" });
        return navigator.share({ files: [datei], title: titel });
    }).catch(function () { /* Teilen abgebrochen */ });
}
function bildKopieren(svg, dateiname, knopf) {
    // Kurze Rückmeldung im Knopf, danach wieder der ursprüngliche Text
    function melden(text) {
        if (!knopf) return;
        var alt = knopf.dataset.text || knopf.textContent;
        knopf.dataset.text = alt;
        knopf.textContent = text;
        setTimeout(function () { knopf.textContent = alt; }, 1800);
    }
    // Ohne Zugriff auf die Zwischenablage wird das Bild stattdessen heruntergeladen
    function ersatz() { bildSpeichern(svg, dateiname); melden("Gespeichert ⬇"); }
    if (!navigator.clipboard || !window.ClipboardItem) { ersatz(); return; }
    // Safari verlangt, dass das Bild als Promise übergeben wird
    navigator.clipboard.write([new ClipboardItem({ "image/png": svgBild(svg) })])
        .then(function () { melden("Kopiert ✓"); })
        .catch(ersatz);
}
function akkordSpeichern(name) { bildSpeichern(akkordSvg(name), "Akkord-" + name + ".png"); }
function akkordTeilen(name) { bildTeilen(akkordSvg(name), "Akkord-" + name + ".png", "Akkord " + name); }
function akkordKopieren(name, knopf) { bildKopieren(akkordSvg(name), "Akkord-" + name + ".png", knopf); }

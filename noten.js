// =============================================================================
// Notenbilder für die Ton-Würfel (Stammton, Chromatik)
// =============================================================================
// Die Würfel nennen Töne in Helmholtz-Schreibweise (klingend):
//   E F G A B  = grosse Oktave (tiefe E-Saite …)
//   c … b      = kleine Oktave
//   c' … b'    = eingestrichen (leere hohe e-Saite = e')
//   c'' …      = zweigestrichen (e'' = hohe e-Saite, 12. Bund)
// Vorzeichen stehen direkt nach dem Buchstaben: "c#'", "bb", "Fb".
// "B" ist wie im Würfel der Ton H.
//
// Notiert wird wie in der Gitarrenliteratur: Violinschlüssel mit kleiner 8 darunter,
// eine Oktave höher als klingend (tiefes E = drei Hilfslinien unter dem System).

// Violinschlüssel (gemeinfrei, Wikimedia Commons "GClef.svg"), Grösse 15.19 × 40.77
var VIOLINSCHLUESSEL = "m12.049 3.5296c0.305 3.1263-2.019 5.6563-4.0772 7.7014-0.9349 0.897-0.155 0.148-0.6437 0.594-0.1022-0.479-0.2986-1.731-0.2802-2.11 0.1304-2.6939 2.3198-6.5875 4.2381-8.0236 0.309 0.5767 0.563 0.6231 0.763 1.8382zm0.651 16.142c-1.232-0.906-2.85-1.144-4.3336-0.885-0.1913-1.255-0.3827-2.51-0.574-3.764 2.3506-2.329 4.9066-5.0322 5.0406-8.5394 0.059-2.232-0.276-4.6714-1.678-6.4836-1.7004 0.12823-2.8995 2.156-3.8019 3.4165-1.4889 2.6705-1.1414 5.9169-0.57 8.7965-0.8094 0.952-1.9296 1.743-2.7274 2.734-2.3561 2.308-4.4085 5.43-4.0046 8.878 0.18332 3.334 2.5894 6.434 5.8702 7.227 1.2457 0.315 2.5639 0.346 3.8241 0.099 0.2199 2.25 1.0266 4.629 0.0925 6.813-0.7007 1.598-2.7875 3.004-4.3325 2.192-0.5994-0.316-0.1137-0.051-0.478-0.252 1.0698-0.257 1.9996-1.036 2.26-1.565 0.8378-1.464-0.3998-3.639-2.1554-3.358-2.262 0.046-3.1904 3.14-1.7356 4.685 1.3468 1.52 3.833 1.312 5.4301 0.318 1.8125-1.18 2.0395-3.544 1.8325-5.562-0.07-0.678-0.403-2.67-0.444-3.387 0.697-0.249 0.209-0.059 1.193-0.449 2.66-1.053 4.357-4.259 3.594-7.122-0.318-1.469-1.044-2.914-2.302-3.792zm0.561 5.757c0.214 1.991-1.053 4.321-3.079 4.96-0.136-0.795-0.172-1.011-0.2626-1.475-0.4822-2.46-0.744-4.987-1.116-7.481 1.6246-0.168 3.4576 0.543 4.0226 2.184 0.244 0.577 0.343 1.197 0.435 1.812zm-5.1486 5.196c-2.5441 0.141-4.9995-1.595-5.6343-4.081-0.749-2.153-0.5283-4.63 0.8207-6.504 1.1151-1.702 2.6065-3.105 4.0286-4.543 0.183 1.127 0.366 2.254 0.549 3.382-2.9906 0.782-5.0046 4.725-3.215 7.451 0.5324 0.764 1.9765 2.223 2.7655 1.634-1.102-0.683-2.0033-1.859-1.8095-3.227-0.0821-1.282 1.3699-2.911 2.6513-3.198 0.4384 2.869 0.9413 6.073 1.3797 8.943-0.5054 0.1-1.0211 0.143-1.536 0.143z";

var NOTEN_FARBE = { linie: "#0b1220", papier: "#ffffff", grau: "#5a6785" };

// "c#'" → { stufe: diatonische Höhe der notierten Note, vorzeichen: "#" | "b" | "" }
// stufe 0 = e' notiert (unterste Notenlinie), jede Stufe = eine Linie bzw. ein Zwischenraum
function notePosition(name) {
    var buchstabe = name.charAt(0);
    var klein = buchstabe === buchstabe.toLowerCase();
    var striche = (name.match(/'/g) || []).length;
    var vorzeichen = (name.slice(1).match(/[#b]/) || [""])[0];
    // Oktave nach wissenschaftlicher Zählung (klingend): E = E2, e = E3, e' = E4 …
    var oktave = (klein ? 3 : 2) + striche;
    var index = "cdefgab".indexOf(buchstabe.toLowerCase());
    var notiert = (oktave + 1) * 7 + index;              // Gitarre: eine Oktave höher notiert
    return { stufe: notiert - (4 * 7 + 2), vorzeichen: vorzeichen };   // relativ zu E4 (unterste Linie)
}

// Zeichnet die Töne als ganze Noten (ohne Takt), mehrere Zeilen untereinander in einem SVG.
//   optionen.namen:    Tonnamen unter die Noten schreiben (Standard: ja)
//   optionen.proZeile: Noten pro Zeile (Standard: 5)
function notenSvg(toene, optionen) {
    optionen = optionen || {};
    var proZeile = optionen.proZeile || 5;
    var zeilen = [];
    for (var i = 0; i < toene.length; i += proZeile) zeilen.push(toene.slice(i, i + proZeile));
    if (!zeilen.length) zeilen.push([]);
    var breite = 52 + proZeile * 46 + 10;
    var teile = [], hoehe = 0;
    zeilen.forEach(function (zeile) {
        var z = notenZeile(zeile, breite, optionen.namen !== false);
        teile.push('<g transform="translate(0 ' + hoehe + ')">' + z.inhalt + '</g>');
        hoehe += z.hoehe;
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' ' + hoehe + '" width="' + breite + '" height="' + hoehe +
        '" role="img" aria-label="Noten: ' + toene.join(" ") + '">' +
        '<rect width="' + breite + '" height="' + hoehe + '" rx="14" fill="' + NOTEN_FARBE.papier + '"/>' + teile.join("") + '</svg>';
}

// Eine Notenzeile: Notenlinien, Violinschlüssel mit 8, Noten mit Hilfslinien und Vorzeichen
function notenZeile(toene, breite, mitNamen) {
    var abstand = 10;                                    // Abstand der Notenlinien
    var oben = 52;                                       // y der obersten Notenlinie (Platz für Hilfslinien)
    var unten = oben + 4 * abstand;                      // y der untersten Notenlinie (Stufe 0)
    var xStart = 52, schritt = 46;
    var hoehe = unten + 5 * abstand + (mitNamen ? 34 : 14);
    var schrift = 'font-family="Avenir Next, Helvetica Neue, Arial, sans-serif"';
    var t = [];
    function y(stufe) { return unten - stufe * abstand / 2; }

    // Fünf Notenlinien
    for (var l = 0; l < 5; l++) {
        t.push('<line x1="10" y1="' + (oben + l * abstand) + '" x2="' + (breite - 10) + '" y2="' + (oben + l * abstand) + '" stroke="' + NOTEN_FARBE.linie + '" stroke-width="1.2"/>');
    }
    // Violinschlüssel: Spirale auf der g-Linie (2. Linie von unten), kleine 8 darunter
    var s = 1.78;                                        // Massstab des Schlüssels
    t.push('<path transform="translate(14 ' + (y(2) - 25.6 * s).toFixed(2) + ') scale(' + s + ')" d="' + VIOLINSCHLUESSEL + '" fill="' + NOTEN_FARBE.linie + '"/>');
    t.push('<text x="27" y="' + (y(2) + 15.5 * s + 9) + '" text-anchor="middle" ' + schrift + ' font-size="11" font-weight="700" fill="' + NOTEN_FARBE.linie + '">8</text>');

    toene.forEach(function (name, i) {
        var p = notePosition(name), x = xStart + i * schritt + schritt / 2, yy = y(p.stufe);
        // Hilfslinien unter und über dem System
        for (var h = -2; h >= p.stufe; h -= 2) t.push(hilfslinie(x, y(h)));
        for (var g = 10; g <= p.stufe; g += 2) t.push(hilfslinie(x, y(g)));
        // Ganze Note: schräg liegendes Oval mit Aussparung
        t.push('<ellipse cx="' + x + '" cy="' + yy + '" rx="7" ry="5" fill="' + NOTEN_FARBE.linie + '"/>');
        t.push('<ellipse cx="' + x + '" cy="' + yy + '" rx="3.4" ry="2.4" transform="rotate(-35 ' + x + ' ' + yy + ')" fill="' + NOTEN_FARBE.papier + '"/>');
        if (p.vorzeichen) t.push(vorzeichenSvg(p.vorzeichen, x - 17, yy));
        if (mitNamen) t.push('<text x="' + x + '" y="' + (hoehe - 12) + '" text-anchor="middle" ' + schrift + ' font-size="12" font-weight="600" fill="' + NOTEN_FARBE.grau + '">' + name + '</text>');
    });
    return { inhalt: t.join(""), hoehe: hoehe };
}

function hilfslinie(x, y) {
    return '<line x1="' + (x - 11) + '" y1="' + y + '" x2="' + (x + 11) + '" y2="' + y + '" stroke="' + NOTEN_FARBE.linie + '" stroke-width="1.6"/>';
}

// Kreuz (#) bzw. b, zentriert auf der Höhe der Note
function vorzeichenSvg(art, x, y) {
    var f = NOTEN_FARBE.linie;
    if (art === "#") {
        return '<g stroke="' + f + '" stroke-linecap="butt">' +
            '<line x1="' + (x - 2) + '" y1="' + (y - 10) + '" x2="' + (x - 2) + '" y2="' + (y + 11) + '" stroke-width="1.2"/>' +
            '<line x1="' + (x + 2) + '" y1="' + (y - 11) + '" x2="' + (x + 2) + '" y2="' + (y + 10) + '" stroke-width="1.2"/>' +
            '<line x1="' + (x - 5) + '" y1="' + (y - 2.5) + '" x2="' + (x + 5) + '" y2="' + (y - 5) + '" stroke-width="3"/>' +
            '<line x1="' + (x - 5) + '" y1="' + (y + 5) + '" x2="' + (x + 5) + '" y2="' + (y + 2.5) + '" stroke-width="3"/></g>';
    }
    // b: senkrechter Strich und Bauch unten rechts
    return '<path d="M' + (x - 3) + ' ' + (y - 14) + 'V' + (y + 5) + 'C' + (x + 1) + ' ' + (y + 2) + ' ' + (x + 6) + ' ' + (y - 1) + ' ' + (x + 5) + ' ' + (y - 4) +
        'C' + (x + 4) + ' ' + (y - 7) + ' ' + (x) + ' ' + (y - 6) + ' ' + (x - 3) + ' ' + (y - 2) + '" fill="none" stroke="' + f + '" stroke-width="1.6" stroke-linejoin="round"/>';
}

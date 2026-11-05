// =============================================================================
// CAGED-Formen als SVG-Griffbrettdiagramme (statt Bilder)
// =============================================================================
// Jede Form ist durch ihren offenen Griff in der "eigenen" Tonart beschrieben
// (C-Form in C, A-Form in A …) und durch ein Bundfenster rund um diesen Griff.
// Für einen gewürfelten Akkord wird das Fenster verschoben; gezeigt werden alle
// Akkordtöne (und auf Wunsch alle Tonleitertöne), die in diesem Fenster liegen.
// So stimmen die Diagramme für jede Tonart automatisch.
//
// Diagramm wie die Akkorde der 1. Lage: hohe e-Saite oben, tiefe E-Saite unten.

var CAGED_FORMEN = {
    // name: { grund: Tonklasse der eigenen Tonart, moll, von/bis: Bundfenster (offener Griff) }
    "C-Form":  { grund: 0,  moll: false, von: 0,  bis: 3 },
    "A-Form":  { grund: 9,  moll: false, von: -1, bis: 3 },
    "G-Form":  { grund: 7,  moll: false, von: -1, bis: 3 },
    "E-Form":  { grund: 4,  moll: false, von: -1, bis: 2 },
    "F-Form":  { grund: 4,  moll: false, von: -1, bis: 2, hinweis: "E-Form als Barré" },
    "D-Form":  { grund: 2,  moll: false, von: -1, bis: 3 },
    "Am-Form": { grund: 9,  moll: true,  von: 0,  bis: 3 },
    "Em-Form": { grund: 4,  moll: true,  von: -1, bis: 3 },
    "Dm-Form": { grund: 2,  moll: true,  von: 0,  bis: 3 }
};

var SAITEN = [4, 9, 2, 7, 11, 4];             // leere Saiten tief E … hoch e als Tonklasse
var STAMM = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11, H: 11 };

// Intervalle der Tonleiter ab Grundton (Halbtöne) und ihre Beschriftung
var DUR_STUFEN  = [[0, "1"], [2, "2"], [4, "3"], [5, "4"], [7, "5"], [9, "6"], [11, "7"]];
var MOLL_STUFEN = [[0, "1"], [2, "2"], [3, "b3"], [5, "4"], [7, "5"], [8, "b6"], [10, "b7"]];
// Moll mit Dur-Zahlen: gezählt ab der parallelen Dur-Tonleiter (Moll-Grundton = 6)
var MOLL_DURZAHLEN = [[0, "6"], [2, "7"], [3, "1"], [5, "2"], [7, "3"], [8, "4"], [10, "5"]];

// "F#", "Bb", "E" … → Tonklasse 0–11
function tonklasse(name) {
    var t = STAMM[name.charAt(0).toUpperCase()];
    for (var i = 1; i < name.length; i++) {
        if (name.charAt(i) === "#") t++;
        if (name.charAt(i) === "b") t--;
    }
    return (t + 12) % 12;
}

var CAGED_FARBE = {
    linie: "#0b1220", grund: "#f2b544", akkord: "#0b1220", akkordText: "#ffffff",
    leiter: "#ffffff", leiterText: "#0b1220", leiterRand: "#8fa8dc", papier: "#ffffff", grau: "#5a6785"
};

// Zeichnet eine Form für einen Akkord.
//   grundName  z. B. "F#" (ohne "m")
//   formName   z. B. "Em-Form"
//   optionen   { tonleiter: true/false, mollDurZahlen: true/false, titel: "F#m: Em-Form" }
function cagedSvg(grundName, formName, optionen) {
    optionen = optionen || {};
    var f = CAGED_FORMEN[formName];
    if (!f) return "";
    var grund = tonklasse(grundName);
    var stufen = !f.moll ? DUR_STUFEN : (optionen.mollDurZahlen ? MOLL_DURZAHLEN : MOLL_STUFEN);
    var akkordStufen = f.moll ? [0, 3, 7] : [0, 4, 7];

    // Fenster verschieben: so tief wie möglich, aber nicht unter den Sattel.
    // Teile unter Bund 0 werden abgeschnitten (offene Lage).
    var schieb = (grund - f.grund + 12) % 12;
    var von = f.von + schieb, bis = f.bis + schieb;
    if (bis < 1) { von += 12; bis += 12; }
    var erster = Math.max(0, von);             // erster gezeigter Bund (0 = leere Saiten)
    var offen = erster === 0;
    var spalten = bis - erster + 1;            // Anzahl gezeigter Bünde (Spalte 0 = leere Saite)

    // Masse
    var x0 = 34, dx = 44, y0 = 50, dy = 22;
    // Immer 5 Bünde breit zeichnen, damit alle Diagramme gleich gross sind
    var nBuende = Math.max(offen ? spalten - 1 : spalten, 5);
    var breite = x0 + nBuende * dx + 18, hoehe = y0 + 5 * dy + 34;
    var teile = [];
    teile.push('<rect width="' + breite + '" height="' + hoehe + '" rx="14" fill="' + CAGED_FARBE.papier + '"/>');
    var schrift = 'font-family="Avenir Next, Helvetica Neue, Arial, sans-serif"';
    teile.push('<text x="16" y="30" ' + schrift + ' font-size="20" font-weight="700" fill="' + CAGED_FARBE.linie + '">' +
        (optionen.titel || (grundName + (f.moll ? "m" : "") + ": " + formName)) + '</text>');
    if (f.hinweis) teile.push('<text x="' + (breite - 16) + '" y="30" text-anchor="end" ' + schrift + ' font-size="12" fill="' + CAGED_FARBE.grau + '">' + f.hinweis + '</text>');

    // Bundlinien: bei offener Lage ist die erste Linie der Sattel, sonst eine normale Linie
    for (var b = 0; b <= nBuende; b++) {
        var x = x0 + b * dx, sattel = offen && b === 0;
        teile.push('<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y0 + 5 * dy) + '" stroke="' + CAGED_FARBE.linie + '" stroke-width="' + (sattel ? 6 : 1.4) + '"' + (sattel ? ' stroke-linecap="round"' : '') + '/>');
    }
    for (var s = 0; s < 6; s++) {
        var y = y0 + s * dy;
        teile.push('<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + nBuende * dx) + '" y2="' + y + '" stroke="' + CAGED_FARBE.linie + '" stroke-width="1.4"/>');
    }
    // Mitte eines Bundes (bei offener Lage liegt Bund 0 links vom Sattel)
    function bundX(bund) {
        if (offen) return bund === 0 ? x0 - 16 : x0 + (bund - 0.5) * dx;
        return x0 + (bund - erster + 0.5) * dx;
    }
    // Bundzahlen unter dem Diagramm: erster Bund und die üblichen Markierungen
    for (var n = Math.max(1, erster); n <= bis; n++) {
        var bx = bundX(n);
        if ([3, 5, 7, 9, 12, 15].indexOf(n) >= 0 || n === Math.max(1, erster)) {
            teile.push('<text x="' + bx + '" y="' + (y0 + 5 * dy + 22) + '" text-anchor="middle" ' + schrift + ' font-size="12" font-weight="600" fill="' + CAGED_FARBE.grau + '">' + n + '</text>');
        }
    }

    // Töne einzeichnen: für jede Saite jeden Bund im Fenster prüfen
    for (var i = 0; i < 6; i++) {
        var yy = y0 + (5 - i) * dy;                         // i = 0 tief E (unten) … 5 hoch e (oben)
        for (var bund = erster; bund <= bis; bund++) {
            var abstand = (SAITEN[i] + bund - grund + 120) % 12;
            var stufe = null;
            for (var k = 0; k < stufen.length; k++) if (stufen[k][0] === abstand) stufe = stufen[k][1];
            if (stufe === null) continue;
            var istAkkord = akkordStufen.indexOf(abstand) >= 0;
            if (!istAkkord && !optionen.tonleiter) continue;
            var cx = bundX(bund);
            var r = istAkkord ? 10 : 8.5;
            var fuellung = abstand === 0 ? CAGED_FARBE.grund : (istAkkord ? CAGED_FARBE.akkord : CAGED_FARBE.leiter);
            var rand = istAkkord ? CAGED_FARBE.linie : CAGED_FARBE.leiterRand;
            var textfarbe = abstand === 0 ? CAGED_FARBE.linie : (istAkkord ? CAGED_FARBE.akkordText : CAGED_FARBE.leiterText);
            teile.push('<circle cx="' + cx + '" cy="' + yy + '" r="' + r + '" fill="' + fuellung + '" stroke="' + rand + '" stroke-width="1.6"/>');
            teile.push('<text x="' + cx + '" y="' + (yy + 4) + '" text-anchor="middle" ' + schrift + ' font-size="' + (stufe.length > 1 ? 9.5 : 11) + '" font-weight="700" fill="' + textfarbe + '">' + stufe + '</text>');
        }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' ' + hoehe + '" width="' + breite + '" height="' + hoehe + '" role="img" aria-label="' +
        (optionen.titel || (grundName + (f.moll ? "m" : "") + " " + formName)) + '">' + teile.join("") + '</svg>';
}

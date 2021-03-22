function TransposeChordsInCurrentDocument(amount: number) {
    transposeChordsInDocument(DocumentApp.getActiveDocument(), amount);
}

function transposeParagraphChords(
    p: GoogleAppsScript.Document.Paragraph,
    amount: number
) {
    let newText = "";
    const whiteSpaceCharRegexp = /\s+/;
    let chord = "";
    for (const char of p.getText()) {
        if (whiteSpaceCharRegexp.exec(char)) {
            if (chord) {
                newText += transposeChord(chord, amount);
                chord = "";
            }
            newText += char;
        } else {
            chord += char;
        }
    }
    p.setText(newText);
    highlightParagraph(p, loadUserChordsColor());
}

function transposeChordsInDocument(
    doc: GoogleAppsScript.Document.Document,
    amount: number
) {
    for (const p of getDocumentChordsParagraphs(doc)) {
        transposeParagraphChords(p, amount);
    }
}

function transposeChord(chord: string, amount: number) {
    const scale: string[] = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];
    
    const normalizeMap: { [id: string]: string } = {
        Cb: "B",
        Db: "C#",
        Eb: "D#",
        Fb: "E",
        Gb: "F#",
        Ab: "G#",
        Bb: "A#",
        "E#": "F",
        "B#": "C",
        "H": "B",
        "H#": "C",
        "Hb": "A#",
    };
    return chord.replace(/[CDEFGABH][b#]?/g, (match) => {
        const i =
            (scale.indexOf(normalizeMap[match] ? normalizeMap[match] : match) +
                amount) %
            scale.length;
        return scale[i < 0 ? i + scale.length : i];
    });
}

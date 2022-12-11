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
  let whiteSpacesToSkip = 0
  for (const char of p.getText()) {
    if (whiteSpaceCharRegexp.exec(char)) {
      if (chord) {
        let transposedChord = transposeChord(chord, amount);
        let whiteSpaceDiff = chord.length - transposedChord.length
        if (whiteSpaceDiff > 0) {
          transposedChord += " ".repeat(whiteSpaceDiff)
        } else {
          whiteSpacesToSkip = whiteSpaceDiff * -1
        }
        newText += transposedChord;
        chord = "";
      }
      if (whiteSpacesToSkip > 0) {
        whiteSpacesToSkip--
        continue
      }
      newText += char;
    } else {
      chord += char;
    }
  }
  if (chord) {
    newText += transposeChord(chord, amount);
    chord = "";
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
    H: "B",
    "H#": "C",
    Hb: "A#",
  };
  return chord.replace(/[CDEFGABH][b#]?/, (match) => {
    const i = (scale.indexOf(normalizeMap[match] ? normalizeMap[match] : match) + amount) % scale.length;
    return scale[i < 0 ? i + scale.length : i];
  });
}

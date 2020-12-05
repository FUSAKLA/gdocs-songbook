function getDocumentChordsParagraphs(doc: GoogleAppsScript.Document.Document) {
  const body = doc.getBody();
  const chordsRe = /^\s*([A-Z][a-zA-Z0-9#!/]{0,6}\s*)+\s*$/;
  const paragraphs = body.getParagraphs();
  const chordsParagraphs: GoogleAppsScript.Document.Paragraph[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (chordsRe.exec(p.getText())) {
      chordsParagraphs.push(p);
    }
  }
  return chordsParagraphs;
}

function getChords(doc: GoogleAppsScript.Document.Document) {
  const chords: string[] = [];
  for (const p of getDocumentChordsParagraphs(doc)) {
    for (const chord of p.getText().split(/\s+/)) {
      if (chord.trim() === "") {
        continue;
      }
      chords.push(chord);
    }
  }
  return chords;
}

function getUniqueChords(doc: GoogleAppsScript.Document.Document) {
  return getChords(doc).filter((v, i, a) => a.indexOf(v) === i);
}

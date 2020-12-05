function AddChordsImagesToCurrentDocument() {
  addChordsImagesToDocument(DocumentApp.getActiveDocument());
}

function addChordsImagesToDocument(doc: GoogleAppsScript.Document.Document) {
  const body = doc.getBody();
  const chordsParagraph = body.appendParagraph("");
  const uniqueChords = getUniqueChords(doc);
  for (const chord of uniqueChords) {
    let imgBlob;
    try {
      imgBlob = getChordImage(chord);
    } catch (e) {
      Logger.log("Failed to get '" + chord + "' chord image: " + e.message);
      continue;
    }
    const img = chordsParagraph
      .appendInlineImage(imgBlob)
      .setAltTitle(chord)
      .setAltDescription(chord);
    img.setHeight(img.getHeight() / 2);
    img.setWidth(img.getWidth() / 2);
  }
}

function getChordImage(chord: string) {
  const url =
    "https://yousongs.cz/img/gChords/" + encodeURIComponent(chord) + ".png";
  return UrlFetchApp.fetch(url).getBlob();
}

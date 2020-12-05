function highlightChordsInDocument(
  document: GoogleAppsScript.Document.Document
) {
  for (const p of getDocumentChordsParagraphs(document)) {
    makeParagraphBold(p);
  }
}

function makeParagraphBold(p: GoogleAppsScript.Document.Paragraph) {
  const newStyle: any = {};
  newStyle[DocumentApp.Attribute.BOLD] = true;
  p.setAttributes(newStyle);
}

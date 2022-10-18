function SaveUserChordsColor(color: string) {
  PropertiesService.getUserProperties().setProperty("chordsColor", color);
}

function loadUserChordsColor() {
  const color = PropertiesService.getUserProperties().getProperty(
    "chordsColor"
  );
  if (color === null) {
    return "#000000";
  }
  return color;
}

function highlightChordsInDocument(
  document: GoogleAppsScript.Document.Document
) {
  for (const p of getDocumentChordsParagraphs(document)) {
    highlightParagraph(p, loadUserChordsColor());
  }
}

function highlightParagraph(
  p: GoogleAppsScript.Document.Paragraph,
  color: string
) {
  p.editAsText().setBold(true).setForegroundColor(color);
}

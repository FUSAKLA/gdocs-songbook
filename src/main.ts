// Plugin environment specific functions.
function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Show panel", "showSidebar")
    .addItem("Highlight chords", "HighlightChordsInCurrentDocument")
    .addItem("Optimize file format", "OptimizeLayoutInCurrentDocument")
    .addItem("Add chords images", "AddChordsImagesToCurrentDocument")
    .addToUi();
}

function onInstall() {
  onOpen();
}

function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile("src/html/sidebar").setTitle(
    "Songbook"
  );
  DocumentApp.getUi().showSidebar(ui);
}

// Plugin environment specific functions.
function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Highlight chords", "HighlightChordsInCurrentDocument")
    .addItem("Show panel", "showSidebar")
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

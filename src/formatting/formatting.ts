function HighlightChordsInCurrentDocument() {
  highlightChordsInDocument(DocumentApp.getActiveDocument());
}

function OptimizeLayoutInCurrentDocument() {
  reformatDocument(DocumentApp.getActiveDocument());
}

function clearFooters(doc: GoogleAppsScript.Document.Document) {
  try {
    doc.getFooter().clear();
  } catch {}
}

function setPageNumber(
  document: GoogleAppsScript.Document.Document,
  pageNumber: number
) {
  const footerStyle: any = {};
  footerStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.CENTER;
  footerStyle[DocumentApp.Attribute.FONT_SIZE] = 9;
  clearFooters(document);
  let footer;
  try {
    footer = document.addFooter();
  } catch (e) {
    footer = document.getFooter();
  }
  const footerParagraph = footer.appendParagraph(pageNumber.toString());
  footerParagraph.setAttributes(footerStyle);
  return footer;
}

function reformatDocument(document: GoogleAppsScript.Document.Document) {
  const minimumFontSize = 8;
  const minimumMargin = 20;
  document.getBody().editAsText().setFontFamily("Roboto Mono");
  const numberOfPages = getPdfBlobNumberOfPages(
    document.getAs("application/pdf")
  );

  if (numberOfPages > 1) {
    document.getBody().editAsText().setFontSize(minimumFontSize);
    document
      .getBody()
      .setMarginLeft(minimumMargin)
      .setMarginRight(minimumMargin);
  }
  document.saveAndClose();
}

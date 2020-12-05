function AddLinkQrCodeToCurrentDocument(link: string) {
  addLinkQrCodeToDocument(DocumentApp.getActiveDocument(), link);
}

function addLinkQrCodeToDocument(
  doc: GoogleAppsScript.Document.Document,
  link: string
) {
  const imgParagraph = doc.getHeader().appendParagraph("");
  imgParagraph
    .addPositionedImage(getLinkQrCodeImage(link))
    .setLayout(DocumentApp.PositionedLayout.ABOVE_TEXT)
    .setTopOffset(-60)
    .setLeftOffset(doc.getBody().getPageWidth() - 110);
}

function getLinkQrCodeImage(link: string) {
  const url =
    "http://api.qrserver.com/v1/create-qr-code/?data=" +
    encodeURIComponent(link) +
    "&size=60x60";
  return UrlFetchApp.fetch(url).getBlob();
}

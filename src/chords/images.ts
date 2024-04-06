const supportedInstruments = ["guitar", "ukulele"];

function SaveUserDiagramSize(size: string) {
  PropertiesService.getUserProperties().setProperty("diagramSize", size);
}

function loadUserDiagramsSize() {
  const size = PropertiesService.getUserProperties().getProperty("diagramSize");
  if (size === null) {
    return "50";
  }
  return size;
}

function AddChordsImagesToCurrentDocument() {
  addChordsImagesToDocument(
    DocumentApp.getActiveDocument(),
    loadUserInstrument()
  );
}

function SaveUserInstrument(instrument: string) {
  PropertiesService.getUserProperties().setProperty(
    "userInstrument",
    instrument
  );
}

function loadUserInstrument() {
  const instrument =
    PropertiesService.getUserProperties().getProperty("userInstrument");
  if (instrument === null) {
    return supportedInstruments[0];
  }
  return instrument;
}

function GetSupportedInstruments() {
  const instruments = [];
  const defaultInstrument = loadUserInstrument();
  for (const i of supportedInstruments) {
    const newInstrument = {
      name: i,
      default: false,
    };
    if (i === defaultInstrument) {
      newInstrument.default = true;
    }
    instruments.push(newInstrument);
  }
  return instruments;
}

function addChordsImagesToDocument(
  doc: GoogleAppsScript.Document.Document,
  instrument: string
) {
  const body = doc.getBody();
  const chordsParagraph = body.appendParagraph("");
  const uniqueChords = getUniqueChords(doc);
  for (const chord of uniqueChords) {
    let imgBlob;
    try {
      imgBlob = getChordImage(instrument, chord);
    } catch (e) {
      Logger.log("Failed to get '" + chord + "' chord image: " + e.message);
      continue;
    }
    const img = chordsParagraph
      .appendInlineImage(imgBlob)
      .setAltTitle(chord)
      .setAltDescription(chord);
    const diagramSize = loadUserDiagramsSize() / 100;
    img.setHeight(img.getHeight() * diagramSize);
    img.setWidth(img.getWidth() * diagramSize);
  }
}

function getChordImage(instrument: string, chord: string) {
  const url =
    "https://songbook.fusakla.cz/assets/chords/" +
    encodeURIComponent(instrument) +
    "/" +
    encodeURIComponent(normalizeChord(chord).replace("/", "\\")) +
    ".png";
  return UrlFetchApp.fetch(url).getBlob();
}

const supportedInstruments = ["guitar", "ukulele"];

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
    let instrument = PropertiesService.getUserProperties().getProperty(
        "userInstrument"
    );
    if (instrument === null) {
        return supportedInstruments[0];
    }
    return instrument;
}

function GetSupportedInstruments() {
    let instruments = [];
    let defaultInstrument = loadUserInstrument();
    for (let i of supportedInstruments) {
        let newInstrument = {
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
        img.setHeight(img.getHeight() / 2);
        img.setWidth(img.getWidth() / 2);
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

interface chordSiteData {
    artist: string;
    songName: string;
    videoLink: string;
    rows: string[];
}

interface importSite {
    domain: string;
    regexp: RegExp;
    processor: (url: string) => chordSiteData;
}

function getSupportedChordsImportSites() {
    return [
        {
            domain: "ultimate-guitar.com",
            regexp: /tabs.ultimate-guitar\.com/,
            processor: getUltimateGuitarChords,
        },
        {
            domain: "pisnicky-akordy.cz",
            regexp: /pisnicky-akordy\.cz/,
            processor: getPisnickyAkordyChords,
        },
        {
            domain: "supermusic.sk",
            regexp: /supermusic\.(cz|sk)/,
            processor: getSupermusicChords,
        },
        {
            domain: "velkyzpevnik.cz",
            regexp: /velkyzpevnik\.cz/,
            processor: getVelkyZpevnikChords,
        },
    ];
}

function writeChordsToDocument(
    document: GoogleAppsScript.Document.Document,
    chords: chordSiteData
) {
    setDocumentHeader(document, chords.songName + " - " + chords.artist);

    const body = document.getBody();
    body.clear();
    let emptyLines = 0;
    const beginning = true;

    for (let i = 0; i < chords.rows.length; i++) {
        const lineText = chords.rows[i].trimRight();
        if (lineText === "") {
            emptyLines++;
            continue;
        }
        if (emptyLines > 0) {
            if (!beginning) {
                body.appendParagraph("");
            }
            emptyLines = 0;
        }
        body.appendParagraph(lineText);
    }

    if (chords.videoLink !== "") {
        addLinkQrCodeToDocument(document, chords.videoLink);
    }
    highlightChordsInDocument(document);
    reformatDocument(document);
}

function importUrl(url: string, currentDoc: boolean) {
    const supportedSites = getSupportedChordsImportSites();
    let chords: chordSiteData;
    let matchingSite: importSite | null = null;
    for (let i = 0; i < supportedSites.length; i++) {
        const site = supportedSites[i];
        if (url.match(site.regexp) === null) {
            continue;
        }
        matchingSite = site;
        break;
    }

    if (matchingSite === null) {
        throw Error("Unsupported site for import.");
    }

    try {
        chords = matchingSite.processor(url);
    } catch (e) {
        throw Error(
            "Failed to import data from " + matchingSite.domain + ": " + e.message
        );
    }

    if (chords === null || chords.rows.length === 0) {
        throw Error("Import error: No chords found.");
    }

    let targetDoc = DocumentApp.getActiveDocument();
    const fileName = chords.songName + " - " + chords.artist;
    if (!currentDoc) {
        targetDoc = DocumentApp.create(fileName);
        if (getChordsDir() !== null) {
            // @ts-ignore
            DriveApp.getFileById(targetDoc.getId()).moveTo(getChordsDir());
        }
    } else {
        targetDoc.getBody().clear();
        targetDoc.setName(fileName);
    }

    writeChordsToDocument(targetDoc, chords);

    return targetDoc.getUrl();
}

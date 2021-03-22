function setDocumentHeader(
    document: GoogleAppsScript.Document.Document,
    headerText: string
) {
    const headerStyle: any = {};
    headerStyle[DocumentApp.Attribute.BOLD] = true;
    headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = "#ff0000";
    headerStyle[DocumentApp.Attribute.FONT_SIZE] = 15;

    let header = document.getHeader();
    if (header !== null) {
        header.clear();
    } else {
        header = document.addHeader();
    }
    const headerParagraph = header.appendParagraph(headerText);
    headerParagraph.setAttributes(headerStyle);
    return header;
}

function showDialog(title: string, content: string) {
    const t = HtmlService.createTemplateFromFile("src/html/dialog");
    t.content = content;
    const html = t.evaluate().setWidth(600).setHeight(200);
    DocumentApp.getUi().showModalDialog(html, title);
}

function showMessage(message: string) {
    showDialog("Songbook has some news for you!", message);
}

function showErrorMessage(errorMessage: string) {
    showDialog(
        "Oops, something is not right",
        "<div class='error'>" + errorMessage + "</div>"
    );
}

function askForString(message: string) {
    const ui = DocumentApp.getUi();
    const result = ui.prompt(
        "Songbook asks for...",
        message,
        ui.ButtonSet.OK_CANCEL
    );
    if (result.getSelectedButton() in [ui.Button.CANCEL, ui.Button.CLOSE]) {
        return null;
    }
    return result.getResponseText();
}

function getChordsDir() {
    let chordDirId: null;
    chordDirId = PropertiesService.getUserProperties().getProperty("chordsDir");
    if (chordDirId === null) {
        throw Error("You have to select the chords folder");
    }
    return DriveApp.getFolderById(chordDirId);
}

function setChordsDir(folderId: string) {
    PropertiesService.getUserProperties().setProperty("chordsDir", folderId);
}

function getChordsFolderStructure() {
    return getCachedFolderStructure(getChordsDir());
}

// @ts-ignore
function getCachedFolderStructure(folder: GoogleAppsScript.Drive.Folder) {
    const cache_key = "chordsDirStructure";
    const cache = CacheService.getUserCache();
    if (cache === null) {
        throw Error("missing user cache");
    }
    const cached = cache.get(cache_key);
    if (cached !== null) {
        return JSON.parse(cached);
    }
    const res = getFolderStructure(folder);
    cache.put(cache_key, JSON.stringify(res), 3000);
    return res;
}

interface fileInfo {
    id: string;
    name: string;
    link: string;
}

interface folderStructure {
    id: string;
    name: string;
    link: string;
    files: fileInfo[];
    folders: folderStructure[];
}

// @ts-ignore
function getFolderStructure(folder: GoogleAppsScript.Drive.Folder) {
    const res: folderStructure = {
        id: folder.getId(),
        name: folder.getName(),
        link: folder.getUrl(),
        files: [],
        folders: [],
    };
    const filesIterator = folder.getFiles();
    while (filesIterator.hasNext()) {
        const file = filesIterator.next();
        if ([TOC_FILE_NAME].indexOf(file.getName()) >= 0) {
            continue;
        }
        res.files.push({
            name: file.getName(),
            id: file.getId(),
            link: file.getUrl(),
        });
    }
    res.files.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const foldersIterator = folder.getFolders();
    while (foldersIterator.hasNext()) {
        const subFolder = foldersIterator.next();
        if (
            [PRINT_DIR_NAME, SONGBOOKS_DIR_NAME].indexOf(subFolder.getName()) >= 0
        ) {
            continue;
        }
        res.folders.push(getFolderStructure(subFolder));
    }
    res.folders.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return res;
}

function getFolders() {
    const dirList = [];
    const folders = DriveApp.getFolders();
    let defaultDirId: string = ""
    try {
        defaultDirId = getChordsDir().getId();
    } catch (e) {
    }
    while (folders.hasNext()) {
        const f = folders.next();

        dirList.push({
            name: f.getName(),
            id: f.getId(),
            default: f.getId() === defaultDirId,
        });
    }
    return dirList;
}

function unescapeHtmlSpecialCharacters(html: string) {
    return html
        .replace(/&eacute;/g, "é")
        .replace(/&Eacute;/g, "É")
        .replace(/&iacute;/g, "í")
        .replace(/&Iacute;/g, "Í")
        .replace(/&aacute;/g, "á")
        .replace(/&Aacute;/g, "Á")
        .replace(/&oacute;/g, "ó")
        .replace(/&Oacute;/g, "Ó")
        .replace(/&uacute;/g, "ú")
        .replace(/&Uacute;/g, "Ú")
        .replace(/&yacute;/g, "ý")
        .replace(/&Yacute;/g, "Ý")
        .replace(/&#154;/g, "š")
        .replace(/&#138;/g, "Š")
        .replace(/&scaron;/g, "Š")
        .replace(/&Scaron;/g, "Š")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&rsquo;/g, "’");
}

function getPdfBlobNumberOfPages(pdfBlob: any) {
    return pdfBlob.getDataAsString().split("/Contents").length - 1;
}

interface songbookFileInfo {
    orderId: number;
    songName: string;
    numberOfPages: number;
}

const PRINT_DIR_NAME = "PRINT";

function PreparePrintDir(dirId: string) {
    const songbookDir = DriveApp.getFolderById(dirId);
    const existing = songbookDir.getFoldersByName(PRINT_DIR_NAME);
    while (existing.hasNext()) {
        existing.next().setTrashed(true);
    }
    songbookDir.createFolder(PRINT_DIR_NAME);
}

function getPrintDir(dirId: string) {
    const songbookDir = DriveApp.getFolderById(dirId);
    const existing = songbookDir.getFoldersByName(PRINT_DIR_NAME);
    if (existing.hasNext()) {
        return existing.next();
    }
    return songbookDir.createFolder(PRINT_DIR_NAME);
}

function generatePrintablePdfs(
    dirId: string,
    documentIds: string[],
    startId: number
) {
    const printDir = getPrintDir(dirId);
    const generatedFiles: songbookFileInfo[] = [];
    Logger.log(documentIds);
    for (const docId of documentIds) {
        let d: GoogleAppsScript.Document.Document;
        try {
            d = DocumentApp.openById(docId);
        } catch (e) {
            Logger.log("Unable to print file with id: " + docId);
            continue;
        }
        setPageNumber(d, startId);
        d.saveAndClose();
        const doc = DriveApp.getFileById(docId);
        const pdfInfo = generateFilePdf(doc, startId.toString() + "-");
        d = DocumentApp.openById(docId);
        clearFooters(d);
        d.saveAndClose();
        // @ts-ignore
        pdfInfo.pdf.moveTo(printDir);
        generatedFiles.push({
            orderId: startId,
            songName: pdfInfo.songName,
            numberOfPages: pdfInfo.numberOfPages,
        });
        startId++;
    }
    return generatedFiles;
}

// @ts-ignore
function generateFilePdf(file: GoogleAppsScript.Drive.File, namePrefix = "") {
    let pdfBlob;
    let nameSuffix = ".pdf";
    if (file.getMimeType() === "application/pdf") {
        pdfBlob = file.getBlob();
        nameSuffix = "";
    } else {
        pdfBlob = file.getAs("application/pdf");
    }
    const numberOfPages = getPdfBlobNumberOfPages(pdfBlob);
    const songName = file.getName();
    const pdf = DriveApp.createFile(pdfBlob).setName(
        namePrefix + songName + nameSuffix
    );
    return {
        pdf,
        numberOfPages,
        songName,
    };
}

function generatePrintTocFile(
    title: string,
    dstDirId: string,
    content: songbookFileInfo[]
) {
    const dstDir = getPrintDir(dstDirId);
    const tocDoc = DocumentApp.create("TOC");
    const tocFile = DriveApp.getFileById(tocDoc.getId());
    // @ts-ignore
    tocFile.moveTo(dstDir);
    setDocumentHeader(tocDoc, title);
    const tocDocBody = tocDoc.getBody();
    tocDocBody.editAsText().setFontSize(8);
    let songId = 1;
    for (const fileInfo of content) {
        tocDocBody.appendParagraph(
            songId.toString() + " ............. " + fileInfo.songName
        );
        //pageNumber += fileInfo.numberOfPages;
        songId++;
    }
    tocDoc.saveAndClose();
    const tocInfo = generateFilePdf(tocFile, "0-");
    // @ts-ignore
    tocInfo.pdf.moveTo(dstDir);
    return dstDir.getUrl();
}

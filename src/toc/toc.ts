import DocumentApp = GoogleAppsScript.Document.DocumentApp;

const TOC_FILE_NAME = "TOC";

function generateToc() {
    const chordsFolder = getChordsDir();
    if (chordsFolder === null) {
        throw Error("You have to specify the chords folder.");
    }

    const structure = getCachedFolderStructure(chordsFolder);

    let tocFile: GoogleAppsScript.Document.Document;
    const existingTocFiles = chordsFolder.getFilesByName(TOC_FILE_NAME);
    if (existingTocFiles.hasNext()) {
        tocFile = DocumentApp.openById(existingTocFiles.next().getId());
        tocFile.getBody().clear();
    } else {
        tocFile = DocumentApp.create(TOC_FILE_NAME);
        // @ts-ignore
        DriveApp.getFileById(tocFile.getId()).moveTo(chordsFolder);
    }
    writeTocToFile(tocFile, structure);
    return tocFile.getUrl();
}

function writeTocToFile(
    document: GoogleAppsScript.Document.Document,
    structure: folderStructure
) {
    setDocumentHeader(
        document,
        "Table of contents        (generated, do not edit by hand)"
    );
    writeFolderToBody(document.getBody(), structure, 0);
}

function nestLevelToHeading(lvl: number) {
  switch (lvl) {
    case 0: {
      return DocumentApp.ParagraphHeading.HEADING1
    }
    case 1: {
      return DocumentApp.ParagraphHeading.HEADING2
    }
    case 2: {
      return DocumentApp.ParagraphHeading.HEADING3
    }
    case 3: {
      return DocumentApp.ParagraphHeading.HEADING4
    }
    case 4: {
      return DocumentApp.ParagraphHeading.HEADING5
    }
    default: {
      return DocumentApp.ParagraphHeading.HEADING6
    }
  }
}


function writeFolderToBody(
    body: GoogleAppsScript.Document.Body,
    folder: folderStructure,
    nestingLevel: number
) {
    let i;
    const indentationStep = 4
    const indentation = " ".repeat(nestingLevel);
    const fileStyle: any = {};
    fileStyle[DocumentApp.Attribute.BOLD] = false;
    const folderStyle: any = {};
    folderStyle[DocumentApp.Attribute.BOLD] = true;
    folderStyle[DocumentApp.Attribute.HEADING] = nestLevelToHeading(nestingLevel/indentationStep)

    for (i = 0; i < folder.files.length; i++) {
        const folderFile = folder.files[i];
        const fileItem = body.appendParagraph(indentation + "- ");
        fileItem.appendText(folderFile.name).setLinkUrl(folderFile.link);
        fileItem.setAttributes(fileStyle);
    }

    for (i = 0; i < folder.folders.length; i++) {
        const subFolder = folder.folders[i];
        const folderItem = body.appendParagraph("\n" + indentation);
        folderItem.appendText(subFolder.name).setLinkUrl(subFolder.link);
        folderItem.setAttributes(folderStyle);

        writeFolderToBody(body, subFolder, nestingLevel + indentationStep);
    }
}

const SONGBOOKS_DIR_NAME = "SONGBOOKS";

function manageSongbooks() {
  const htmlOutput = HtmlService.createTemplateFromFile("src/html/songbook")
    .evaluate()
    .setWidth(900)
    .setHeight(900);
  DocumentApp.getUi().showModalDialog(htmlOutput, "Manage my songbooks");
}

function listSongbooks() {
  const songbooksFolder = getSongbooksFolder();
  const songbooksFound = songbooksFolder.getFolders();
  const songbooks = [];
  const lastEditedSongbook = getLastEditedSongbookId();
  while (songbooksFound.hasNext()) {
    const songbook = songbooksFound.next();
    songbooks.push({
      name: songbook.getName(),
      id: songbook.getId(),
      lastEdited: songbook.getId() === lastEditedSongbook,
    });
  }
  return songbooks;
}

function getSongbooksFolder() {
  const chordsDir = getChordsDir();
  const songbooksFolders = chordsDir.getFoldersByName(SONGBOOKS_DIR_NAME);
  if (songbooksFolders.hasNext()) {
    return songbooksFolders.next();
  } else {
    return chordsDir.createFolder(SONGBOOKS_DIR_NAME);
  }
}

function saveLastEditedPlaybookId(id: string) {
  PropertiesService.getUserProperties().setProperty("lastUsedSongbook", id);
}

function getLastEditedSongbookId() {
  return PropertiesService.getUserProperties().getProperty("lastUsedSongbook");
}

function saveSongbook(songbookName: string, fileIds: string[]) {
  const songbooksFolder = getSongbooksFolder();
  DeleteSongbook(songbookName);
  const songbookDir = songbooksFolder.createFolder(songbookName);
  for (let i = 0; i < fileIds.length; i++) {
    // @ts-ignore
    songbookDir.createShortcut(fileIds[i]);
  }
  return songbookDir.getUrl();
}

function DeleteSongbook(songbookName: string) {
  const songbooksFolder = getSongbooksFolder();
  const songbooksFound = songbooksFolder.getFoldersByName(songbookName);
  while (songbooksFound.hasNext()) {
    songbooksFound.next().setTrashed(true);
  }
}

function getSongbookFileIds(songbookId: string) {
  const songbook = DriveApp.getFolderById(songbookId);
  const fileIds = [];
  const songbookFiles = songbook.getFiles();
  while (songbookFiles.hasNext()) {
    const f = songbookFiles.next();
    // @ts-ignore
    fileIds.push(f.getTargetId());
  }
  return fileIds;
}

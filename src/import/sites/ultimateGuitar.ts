function getUltimateGuitarChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  // HTML is not valid to be parsed using the XMLService.parse.
  // Thus we need to select only the HTML escaped JSON containing page data including the text with chords.
  // Then we need to unescape the HTML special characters and than we can parse it using the JSON.parse.
  const jsStoreRegexpMatch = /<div class="js-store" data-content="([^"]+)">/;
  const jsStoreMatch = html.match(jsStoreRegexpMatch);
  if (jsStoreMatch === null || jsStoreMatch.length !== 2) {
    throw Error("js-store was not found in the page HTML.");
  }
  const jsStore = JSON.parse(unescapeHtmlSpecialCharacters(jsStoreMatch[1]));
  let chordsText = jsStore.store.page.data.tab_view.wiki_tab.content;
  chordsText = chordsText
    .replace(/\[tab]/g, "")
    .replace(/\[\/tab]/g, "")
    .replace(/\[ch]/g, "")
    .replace(/\[\/ch]/g, "");
  return {
    artist: jsStore.store.page.data.tab.artist_name,
    songName: jsStore.store.page.data.tab.song_name,
    videoLink: "",
    rows: chordsText.split("\n"),
  };
}

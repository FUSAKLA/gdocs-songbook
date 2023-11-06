function getVelkyDashZpevnikChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsDivRegexp =
    /<div class="ps-3 song-text">.*<pre>([\s\S]*)<\/pre>/g;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the chordbox pre.");
  }
  const chordsText = chordsDivMatch[0].replace(/<[^>]+>/g, "");
  const metadataRegexp = /content="Velký zpěvník : ([^"]+) - ([^"]+)"/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  return {
    artist: metadataMatch[1],
    songName: metadataMatch[2],
    videoLink: "",
    rows: chordsText.split("\n"),
  };
}

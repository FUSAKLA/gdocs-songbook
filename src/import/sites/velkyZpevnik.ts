function getVelkyZpevnikChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsDivRegexp = /<pre[^>]+id="chordbox"[^>]*>([\s\S]*)<\/pre>/g;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the chordbox pre.");
  }
  const chordsText = chordsDivMatch[0].replace(/<[^>]+>/g, "");
  const metadataRegexp = /<title>(.+) - (.+) » Velký zpěvník.cz/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  return {
    artist: metadataMatch[2],
    songName: metadataMatch[1],
    videoLink: "",
    rows: chordsText.split("\n"),
  };
}

function getCifraclubChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsDivRegexp = /<pre>\s*(\S[\s\S]*)<\/pre>/g;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the <pre> chords part.");
  }
  const chordsText = chordsDivMatch[0].replace(/<[^>]+>/g, "");
  const metadataRegexp = /<title>(.+) - (.+) -.*<\/title>/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  let youtubeLink = "";
  // Not sure where to find the link to the youtube video.
  // const youtubeLinkRegexp = /href="([^"]+)".*title="YouTube"/;
  // const youtubeMatch = html.match(youtubeLinkRegexp);
  // if (youtubeMatch && youtubeMatch.length === 2) {
  //   youtubeLink = youtubeMatch[1];
  // }
  return {
    artist: metadataMatch[2],
    songName: metadataMatch[1],
    videoLink: youtubeLink,
    rows: chordsText.split("\n"),
  };
}

function getKytaryCzChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsDivRegexp = /(<div class="scs-section".*\n)/;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the songtext div");
  }

  const chordsText = chordsDivMatch[1]
    .replace(/<br>/g, "\n")
    .replace(/<char>&nbsp;<\/char>/g, " ")
    .replace(/<span class="scs-ch[kv]">([^<]+)<\/span>/g, "$1")
    .replace(/<div class="scs-chord">([^<]+)<\/div>/g, "%$1%")
    .replace(/<div>([^<]+)<\/div>/g, "$1\n")
    .replace(
      /<div class="scs-section" data-type="([^"]+)">([^<]+)<\/div>/g,
      "$1:\n$2\n\n"
    );
  const metadataRegexp = /<title>(.*) - (.*) \| Akordy<\/title>/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  let youtubeLink = "";
  const youtubeLinkRegexp = /<div class="song-video-block-inner">.*<iframe.*src="([^"]+)"/;
  const youtubeMatch = html.match(youtubeLinkRegexp);
  if (youtubeMatch && youtubeMatch.length >= 2) {
    youtubeLink = youtubeMatch[1];
  }
  return {
    artist: metadataMatch[1],
    songName: metadataMatch[2],
    videoLink: youtubeLink,
    rows: extractInlineChords(chordsText.split("\n")),
  };
}

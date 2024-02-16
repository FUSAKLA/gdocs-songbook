function getSongbookFunChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsDivRegexp = /<section class="Col2">\s*(\S[\s\S]*)<\/section>/g;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the songtext div.");
  }
  const chordsText = chordsDivMatch[0]
    .replace(
      /<span class="Song-chord" data-chord="([^"]+)"><\/span>/g,
      function (a: string, b: string) {
        return "%" + b.replace(/,/g, "").replace(/↓/g, "") + "%";
      }
    )
    .replace(/<\/p>/g, " \n")
    .replace(/<br>/g, " \n")
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]+>/g, "");
  const metadataRegexp =
    /<title>(.+) Chords &amp; Tabs by (.+) for Ukulele.*<\/title>/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  let youtubeLink = "";
  const youtubeLinkRegexp = /href="([^"]+)".*title="YouTube"/;
  const youtubeMatch = html.match(youtubeLinkRegexp);
  if (youtubeMatch && youtubeMatch.length === 2) {
    youtubeLink = youtubeMatch[1];
  }
  return {
    artist: metadataMatch[1],
    songName: metadataMatch[2],
    videoLink: youtubeLink,
    rows: extractInlineChords(chordsText.split("\n")),
  };
}

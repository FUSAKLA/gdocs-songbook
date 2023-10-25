function getLacuerdaChords(url: string) {

  // There is some weird stuff going on with the anchors and JS on this site.
  // The anchors are not really anchors, but some JS that changes the content, BUT you can specify the version of songs
  // also in the URL path, BUT the anchor has priority, BUT if the anchor is 1, it is not in the URL as other versions but without number.
  // I love it.
  const urlParts = url.split("#")
  url = urlParts[0];
  if (urlParts.length > 1) {
    let replacement = "-"+urlParts[1]+".shtml"
    if (urlParts[1] == "1") {
      replacement = ".shtml"
    }
    url = urlParts[0].replace(/(-\d+)?\.shtml/, replacement);
  }

  const html = UrlFetchApp.fetch(url, {'escaping': false}).getContentText();
  const chordsDivRegexp = /<div id=t_body>\s*(\S[\s\S]*)<\/PRE>\s*<\/div>/g;
  const chordsDivMatch = html.match(chordsDivRegexp);
  if (chordsDivMatch === null) {
    throw Error("failed to find the t_body div.");
  }
  const chordsText = chordsDivMatch[0].replace(/<[^>]+>/g, "");
  const metadataRegexp = /<div id=tH1><h1><[^>]+>([^<]+)<\/a>.*<h2><[^>]+>([^<]+)<\/a>/;
  const metadataMatch = html.match(metadataRegexp);
  if (metadataMatch === null || metadataMatch.length !== 3) {
    throw Error("failed to find the chords metadata.");
  }
  let youtubeLink = "";
  const youtubeLinkRegexp = /ytVid = "\/\/www.youtube.com\/embed\/([^"]+)"/;
  const youtubeMatch = html.match(youtubeLinkRegexp);
  if (youtubeMatch && youtubeMatch.length === 2) {
    youtubeLink = youtubeMatch[1];
  }
  return {
    artist: metadataMatch[2],
    songName: metadataMatch[1],
    videoLink: "https://www.youtube.com/watch?v="+youtubeLink,
    rows: chordsText.split("\n"),
  };
}

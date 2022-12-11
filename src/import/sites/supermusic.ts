function getSupermusicChords(url: string) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const chordsHtmlRegexp = /<\/SCRIPT>(?<!script)([\s\S]+)\n<script LANGUAGE="JavaScript">/;
  const chordsHtmlMatch = html.match(chordsHtmlRegexp);
  if (chordsHtmlMatch === null) {
    throw Error("failed to find the chords HTML part.");
  }
  const chordsText = chordsHtmlMatch[1]
    .replace(/<\/?br\/?>/g, "\n")
    .replace(/<a[^>]*>([^<]*)<\/a>/g, "%$1%")
    .replace(/<sup>([^<]*)<\/sup>/g, "$1");
  // Get song metadata.
  const titleRegexp = /<title>(.*) - (.*) \[[^\]]*Supermusic]<\/title>/;
  const titleMatch = html.match(titleRegexp);
  if (titleMatch === null || titleMatch.length !== 3) {
    throw Error("failed to extract page title with song name and artist");
  }
  return {
    artist: titleMatch[1],
    songName: titleMatch[2],
    videoLink: "",
    rows: extractInlineChords(chordsText.split("\n")),
  };
}

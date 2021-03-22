function getPisnickyAkordyChords(url: string) {
    const html = UrlFetchApp.fetch(url).getContentText();
    const chordsDivRegexp = /<div id="songtext">\s*(\S[\s\S]*)<\/pre>\s*<\/div>/g;
    const chordsDivMatch = html.match(chordsDivRegexp);
    if (chordsDivMatch === null) {
        throw Error("failed to find the songtext div.");
    }
    const chordsText = chordsDivMatch[0].replace(/<[^>]+>/g, "");
    const metadataRegexp = /<title>(.*) - (.*) - akordy a text písně<\/title>/;
    const metadataMatch = html.match(metadataRegexp);
    if (metadataMatch === null || metadataMatch.length !== 3) {
        throw Error("failed to find the chords metadata.");
    }
    let youtubeLink = "";
    const youtubeLinkRegexp = /class="youtube-player".*src="([^"]+)"/;
    const youtubeMatch = html.match(youtubeLinkRegexp);
    if (youtubeMatch && youtubeMatch.length === 2) {
        youtubeLink = youtubeMatch[1];
    }
    return {
        artist: metadataMatch[1],
        songName: metadataMatch[2],
        videoLink: youtubeLink,
        rows: chordsText.split("\n"),
    };
}

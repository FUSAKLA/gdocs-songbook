function getSupermusicChords(url: string) {
    const html = UrlFetchApp.fetch(url).getContentText();
    const chordsHtmlRegexp = /<\/SCRIPT>(?<!script)([\s\S]+)\n<script LANGUAGE="JavaScript">/;
    const chordsHtmlMatch = html.match(chordsHtmlRegexp);
    if (chordsHtmlMatch === null) {
        throw Error("failed to find the chords HTML part.");
    }
    const chordsText = chordsHtmlMatch[1]
        .replace(/<\/?br\/?>/g, "\n")
        .replace(/<sup>/g, "")
        .replace(/<\/sup>/g, "")
        .replace(/<\/a>/g, "%")
        .replace(/<a[^>]*>/g, "%");
    const chordsTextLines = chordsText.split("\n");
    const chordsRows = [];
    // Chords are inlined, so we have to add new lines with
    // the chords above the text, which requires matching indentation.
    for (let i = 0; i < chordsTextLines.length; i++) {
        const line = chordsTextLines[i];
        if (line.match(/%[^%]+%/) === null) {
            chordsRows.push(line);
            continue;
        }
        let chordsLine = "";
        let textLine = "";
        let isChord = false;
        let indentCorrection = 0;
        for (let j = 0; j < line.length; j++) {
            const character = line.charAt(j);
            if (character === "%") {
                if (!isChord) {
                    const indent = j + indentCorrection - chordsLine.length;
                    if (indent > 0) {
                        chordsLine += " ".repeat(indent);
                    }
                    isChord = true;
                } else {
                    isChord = false;
                }
                indentCorrection -= 1;
                continue;
            }
            if (isChord) {
                chordsLine += character;
                indentCorrection -= 1;
            } else {
                textLine += character;
            }
        }
        chordsRows.push(chordsLine);
        chordsRows.push(textLine);
    }
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
        rows: chordsRows,
    };
}

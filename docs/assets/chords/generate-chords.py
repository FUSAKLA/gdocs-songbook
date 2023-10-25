#!/usr/bin/python3

# How to run:
# docker run -it --network=host -v $PWD:/code --workdir=/code --entrypoint=bash python:3.7 -c "pip install -r requirements.txt && python3 ./generate-chords.py ukulele"

import json
import os
import pathlib
import re
import sys
import urllib
from datetime import datetime

import fretboard
from cairosvg import svg2png

if len(sys.argv) != 2:
    print("""
$1 name of the instrument (guitar,ukulele)
""")

instrument = sys.argv[1]

b_regexp = re.compile(r'B[^m]*')

images_path = instrument

pathlib.Path(images_path).mkdir(parents=True, exist_ok=True)

style = {
    "drawing": {
        "font_size": 8,
        "height": 120,
        "width": 80,
        "spacing": 11,
        # "font_color": "black"
    },
    "marker": {
        "radius": 4,
        "stroke_width": 1,
        # "color": "black",
        # "font_color": "black"
    },
    "heading": {
        "height": 15
    }
}

chord_func_factory = {
    "ukulele": fretboard.UkuleleChord,
    "guitar": fretboard.Chord,
}

index_file = """
## Chord diagrams for {}
""".format(instrument)

start = datetime.now()
with open(instrument + ".json", "r") as f:
    j = json.load(f)
    keys = list(j.keys())
    total_chords = len(keys)
    processed_chords = 0
    print("Generating {} {} chord diagrams to {} ...".format(total_chords, instrument, images_path))
    for chord in keys:
        print(chord)
        chord_file_name = chord.replace("/", "\\")
        urlEscapedChord = urllib.parse.quote_plus(chord_file_name)
        processed_percents = processed_chords / total_chords * 100
        if processed_chords % 100 == 0:
            print("{:.2f}%".format(processed_percents))
        data = j[chord]
        if not data:
            continue
        if b_regexp.match(chord):
            new_chord = "H" + chord[1:]
            keys.append(new_chord)
            j[new_chord] = data
            total_chords += 1
        image_path = os.path.join(images_path, chord_file_name)
        if os.path.isfile(image_path + ".png"):
            index_file += "  - [{}]({})\n".format(chord, urlEscapedChord + ".png")
            processed_chords += 1
            continue

        simplest_positions_id = 0
        max_fret = 100
        for i, d in enumerate(data):
            highest_fret = max([int(x) for x in d["positions"] if x != "x"])
            if highest_fret < max_fret:
                simplest_positions_id = i
                max_fret = highest_fret

        chordDiagram = chord_func_factory[instrument](
            positions="".join(data[simplest_positions_id]["positions"]),
            name=chord, style=style
        )
        chordDiagram.save(image_path + ".svg")
        with open(image_path + ".svg", "rb") as s:
            with open(image_path + ".png", "wb") as p:
                svg2png(file_obj=s, write_to=p)
        os.remove(image_path + ".svg")
        index_file += "  - [{}]({})\n".format(chord, urlEscapedChord + ".png")
        processed_chords += 1

with open(os.path.join(images_path, "index.md"), "w") as f:
    f.write(index_file)

print("Finished in {}".format(datetime.now() - start))

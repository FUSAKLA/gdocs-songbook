## Description and motivation

This plugin is meant to turn your Google Drive into a songbook with chords. There are plenty of sites which provide this
functionality but there is always some catch. Managing song collections, print layout, missing some songs but without
ability to add it, difficulty to see all your songs or lack of mobile app. I could go on but one other main reason was
not to rely on some other site which could become subject to a charge or even get shut down. Having them in Google Docs
makes them probably not go away and easily exportable if needed. Google Drive and Docs offer a simple way to modify the
songs format for print, organize the songs in an arbitrary folder structure, share it with friends, and it’s already
optimized for any devices even with native applications.

![screenshot](/assets/images/screenshot.png)

## How to install it

_Will be added_

## How to run it

The plugin can be used from any opened Google document in the menu `Addons -> Songbook -> Show panel`. This will open a
sidebar with all the functionality provided. You can run some of the functions right from the `Addons -> Songbook` menu.
Those will be applied to the currently opened document.

## How it works

The plugin has some functionality for managing song files in your Drive, for those you need to choose the folder, where
you want to have your songs stored. Once chosen, the plugin will remember it and next time it will be selected as a
default. This is all setup you need to do, now you can start to create your songbook! You can create the song files by
your own or use the [import function](#importing-songs), so you don’t have to write it all by yourselves. If you create
song by yourselves, name the file always as a `Song Name - Band Name`.

## Functions

### Generating a table of contents (TOC)

I like to have my songs organized. For example by a genre, band etc. As your songbook grows, and the folder structure is
becoming more complicated it can be hard to find some songs (even though search is working really nice in GDocs), or you
want to just browse through your songs to choose which you want to play right now. At that moment a table of contents is
what would be really handy right? Well once you select the folder with your songs, the plugin can generate it for you.
Just hit the `Generate songs folder TOC` button and wait a few seconds (may take a bit longer depending on how large
your songbook is). Once done, you should see a popup with a link to the file with TOC. It will be located right in your
songs folder root named `TOC` containing the tree structure of your songs folder with links to all the folders and songs
you have. Just do not forget to generate the TOC once you add new songs!

### Importing songs

Most of the songs are already somewhere out there with lyrics and chords so it would be a shame to copy and paste it by
hand. The plugin supports importing songs from various servers with song chords. The only thing you need to do is copy
the URL on the site where the song is and paste it to the text area in the plugin. Then you can choose if you want to
overwrite the current file with the imported song, otherwise it will create a new one in the root of your songs folder.
The list of currently supported servers can be found in the help text in the plugin. One amongst others is the
[ultimate-guitar.com](https://ultimate-guitar.com) which is one of the biggest on the Internet. If you miss some servers
there, you can [create an issue](https://github.com/FUSAKLA/gdocs-songbook/issues/new/choose)
and if reasonable enough, I’d be happy to add support for it.

### Songbooks

Songbooks are mainly intended for printing but may also work as a selection of songs from yous songs folder. They are
stored in the `SONGBOOKS` folder in the root of your songs folders. Each songbook is stored as a folder with the same
name as the name of the songbook and containing shortcuts to the selected songs.

You can manage them if you click the `Manage my songbooks` button. New window should open with a select box of your
existing songbooks. In the lower part of the window you should see a tree structure of all the songs in your songs
folder with checkboxes. To create a new songbook, check the songs you want to add to it and hit the Save as button. You
will be prompted for a name of the songbook and when provided, it will be stored as the directory described above.

#### Printing

Each songbook can be printed. Unfortunately Google gives a bit limited possibilities to the plugins, so the current
status is that a PDF file will be generated for each of the songbooks’ songs to a `PRINT` folder in the songbook folder.
The PDF file names will be prefixed with numbers of order and in the document, its pages will be numbered also.
Additionally, to it as a first PDF you’ll find a `TOC` PDF with an index of the songbook print. The limitations do not
allow the plugin to merge those together into one single PDF. For this I suggest using for example
the [PDF Mergy](https://pdfmerge.w69b.com/) tool which can easily do this for you.

To print the songbook, just select the one you want to print, and wait until the generating of PDFs finishes. You should
then see a message with a link to the PRINT folder containing the generated files.


---

### Chord tools

Set of tools which helps to create the document with song chords. They are automatically used on
the [imported songs](#importing-songs).

#### Highlight songs

Makes all chords in the document bold, so they can be easily distinguished.

#### Optimize file format

Converts all the text to a monospaced font, so the chords above the text does align. Also tries to optimize the document
layout, so the song fits a single page by lowering the font size and lowering the side margins.

#### Add chord diagrams

In case you do not know any of the chords used in the song, you can automatically add the chord diagrams to the
document. Just choose the instrument you use and hit the Add chord diagrams for. The chord images for all the known
chords will be added to the end of the document (if you find any chord missing, let me know
by [creating an issue](https://github.com/FUSAKLA/gdocs-songbook/issues/new/choose)).

The chords images can be found also [here on the pages](/assets/chords).

#### Inserting QR code with URL

This tool allows you to add a QR code pointing to any URL you like. This is used when importing a song from a server,
which has also linked a Youtube video of the song for example. But you can add whatever URL you like. Just click the
`Insert QR code for URL` and you will be prompted for the URL. Then the QR code image will be added to the upper right
corner of the document. Then when you print the song, anyone can easily scan the QR code and listen to the original song
for example.

#### Transposition

As any other server with song chords the plugin supports transposition of the chords in the song. Just use the `+`
and `-` buttons to transpose the chords. You should also see how much the song is transposed already, but the level of
transposition will be forgotten once the plugin sidebar is closed!


---

### Folder structure example

Example of folder structure of a songs folder with generated `TOC` and saved songbook `celtic` with generated print
PDFs.

```
songs
├── TOC
├── celtic
│   ├── Flogging Molly
│   │   └── The Worst Day Since Yesterday - Flogging Molly
│   └── The Real McKenzies
│       └── Best Day Until Tomorrow - The Real McKenzies
├── czech
│   └── Hm...
│       └── Moje milá - Hm...
└── SONGBOOKS
    └── celtic
        ├── Best Day Until Tomorrow - The Real McKenzies (shortcut)
        ├── The Worst Day Since Yesterday - Flogging Molly (shortcut)
        └── PRINT
            ├── 0 - TOC.pdf
            ├── 1 - The Worst Day Since Yesterday - Flogging Molly.pdf
            └── 2 - Best Day Until Tomorrow - The Real McKenzies.pdf
```

---

### Issues or ideas for improvement

The plugin is just a hobby project of mine and is non-profitable. The code is open source and can be
found [here on GitHub](https://github.com/FUSAKLA/gdocs-songbook). It does not collect any data of yours or read
documents outside the song folder you choose. If you have any idea for improvement or encounter any issue,
please [let me know](https://github.com/FUSAKLA/gdocs-songbook/issues/new/choose), and I’d be happy to resolve it if my
time schedule allows me to.

---

# Happy playing!

> FUSAKLA
>
> ![FUSAKLA](https://avatars3.githubusercontent.com/u/6112562)

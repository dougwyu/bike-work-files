# Work Files — Bike Outliner Extension

A persistent "Work Files" panel in Bike's inspector sidebar. Keep a curated list of `.bike` files and open them with one click — an alternative to the ephemeral "Open Recent" menu.

## Features

- Add `.bike` files via a file picker (`+` button)
- Click a filename to open it (focuses an existing window if already open)
- Remove files with the `×` button
- Drag to reorder the list
- List persists across Bike restarts
- Adapts to light and dark mode

## Getting a file's path

To find the full path of a `.bike` file to add:

- **Finder:** right-click the file, hold Option, then choose **Copy "[name]" as Pathname**
	- You might have to remove the single quotes from around the copied pathname
- **Finder path bar:** View → Show Path Bar, then right-click any segment → **Copy as Pathname**
	- You might have to remove the single quotes from around the copied pathname
- **Terminal:** drag the file into a Terminal window -- it pastes the full path automatically

## Install

1. Build it with `npm install && npm run build` (see Development).
2. Quit Bike.
3. In Finder, press ⌘⇧G and go to `~/Library/Containers/com.hogbaysoftware.Bike/Data/Library/Application Support/Bike/Extensions/`.
4. Copy `out/extensions/files.bkext` into that folder, replacing any older copy.
5. Reopen Bike. The **Work Files** panel appears in the inspector (⌘⌥I).

Use Finder rather than `cp` in a shell: macOS protects Bike's container, and a shell without Full Disk Access gets `Operation not permitted`. Alternatively, `npm test` builds and installs in one step (see below).

## Development

Requires [Node.js](https://nodejs.org).

```bash
npm install
npm run build   # production build → out/extensions/
npm run watch   # watch mode
npm test        # run tests (Bike must be closed)
```

The build system is [`bike-ext`](https://github.com/bike-outliner/extension-kit).

`npm test` installs the build into Bike's sandboxed container (`~/Library/Containers/com.hogbaysoftware.Bike/...`), which macOS protects. Run it from Terminal with Full Disk Access granted (System Settings > Privacy & Security > Full Disk Access). From any other shell the install fails with `EPERM` and the tests silently run against whatever copy is already installed.

## Project structure

```
src/files.bkext/
├── manifest.json       permissions: ["openURL"]
├── app/
│   ├── main.ts         app context — state, message handling
│   └── util.ts         reorderList utility
├── dom/
│   ├── protocols.ts    shared message types (WorkFilesProtocol)
│   └── WorkFiles.tsx   React UI
└── tests/
    └── util.test.ts    unit tests for reorderList
```

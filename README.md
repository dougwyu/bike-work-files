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

Copy the built extension into Bike's extensions directory:

```bash
cp -r out/extensions/work-files.bkext/ \
  ~/Library/Containers/com.hogbaysoftware.Bike/Data/Library/Application\ Support/Bike/Extensions/work-files.bkext/
```

Then reload extensions in Bike (or restart it). The **Work Files** panel appears in the inspector (⌘⌥I).

## Development

Requires [Node.js](https://nodejs.org).

```bash
npm install
npm run build   # production build → out/extensions/
npm run watch   # watch mode
npm test        # run tests (Bike must be closed)
```

The build system is [`bike-ext`](https://github.com/bike-outliner/extension-kit).

### Known issue: missing globals.d.ts

The extension-kit package (installed from GitHub) references `api/core/globals.d.ts` which is absent. After `npm install`, recreate the stub:

```bash
touch node_modules/@bike-outliner/extension-kit/api/core/globals.d.ts
```

## Project structure

```
src/work-files.bkext/
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

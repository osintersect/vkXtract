# vkXtract

vkXtract is a Chrome / Chromium-based browser extension for structured VK extraction, local case building, interactive review, and offline export.

It is designed for investigators, analysts, researchers, and other lawful users who need to collect VK data into a target-specific working case, review it in a live report, and export that case for later offline analysis.

---

## What vkXtract does

vkXtract helps turn VK pages, API responses, and captured interaction data into a structured local case.

At a high level, the extension:

- detects the active VK target while you browse
- stores extraction results locally per target
- supports token-backed VK API extraction
- builds an interactive live report inside the extension
- exports offline case packages for later review
- preserves raw JSON for transparency and follow-up work
- supports English and Ukrainian UI / report localization

vkXtract is not just a simple page scraper. It combines page context, VK API access, local case storage, review workflows, and export handling into one browser-based analyst workflow.

---

## Core capabilities

### 1. Target-aware case workflow

vkXtract works against the current VK target and keeps data separated by case / target.

That includes:

- user targets
- community / group targets
- local per-target storage
- popup rescan / refresh behaviour to align with the current page target

### 2. Profile and network extraction

Depending on target type, available permissions, and returned VK data, vkXtract can extract and review:

- baseline user or community details
- friends / members
- followers
- following / subscriptions
- communities / groups
- family / relatives structures where available

The goal is to preserve structured relationship data for later analysis rather than just dumping raw API output.

### 3. Media extraction and review

vkXtract supports media-oriented workflows for:

- photos
- videos
- clips
- related metadata and captured engagement where available

The report can surface:

- thumbnails and identifiers
- dates and metadata
- geolocation where present
- likes / comments / overlap-style context where captured
- map views for located media

### 4. Wall snapshot workflow

The Wall workflow is snapshot-based.

You can control scope such as:

- maximum post count
- whether comments are included
- whether likes are included
- optional date / time constraints where supported

This is intended to support controlled, reviewable capture rather than endless uncontrolled crawl behaviour.

### 5. Observed analysis

vkXtract includes an Observed workflow for reviewing captured interaction evidence and linked activity patterns.

This surface is intended to support:

- observed interaction review
- linked context building
- chart-based exploratory analysis from captured evidence

### 6. Interactive live report

The extension can open a live report page inside the browser.

This is the main analyst review surface and includes sections such as:

- overview
- family / related structures
- photos
- videos / clips
- wall
- observed
- export / package handling

### 7. Offline package export

vkXtract is a dual-surface tool:

- **live report** inside the extension
- **offline exported package** for later review

Exports are intended to preserve case structure in a portable form, including:

- report shell
- runtime data payload
- raw JSON sidecars
- media evidence folders where available and fetchable

If a package is exported as a ZIP, extract it before opening the exported report files.

### 8. Local-first case storage

vkXtract is built around a local case workflow.

The extension stores working data locally so the user can:

- revisit targets
- reopen stored cases
- continue extraction later
- export data when ready

---

## What the tool is for

vkXtract is intended for:

- OSINT and investigative support
- research and analytical review
- lawful documentation of VK targets
- local case building
- exportable working packages for later review

---

## What the tool is not

vkXtract is not:

- a guarantee of complete data collection
- a guarantee that VK will return all requested data
- a legal authority check
- an identity verification engine
- a replacement for analyst judgement
- a claim that every result is accurate, complete, current, or admissible

Some content may be unavailable, partial, restricted, deleted, blocked, or inaccessible at extraction or export time.

---

## Manual install from a release ZIP

vkXtract is intended to be distributed as a downloadable archive that users manually add to Chrome or another Chromium-based browser in Developer Mode.

### Install steps

1. Download the release ZIP.
2. Extract the ZIP to a normal folder on disk.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted extension folder — the folder that contains `manifest.json` at its top level.
7. Pin the extension if desired.

### Important

- Do not select the ZIP file itself.
- Do not select the wrong parent folder.
- The folder you load must contain `manifest.json` in its root.

---


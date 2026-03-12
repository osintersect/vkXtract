# vkXtract

vkXtract is a Chrome extension for structured VK extraction and analysis.

It is designed for investigators, analysts, researchers, and other lawful users who need to collect publicly accessible or otherwise authorised VK data into a locally stored working case, review it in an interactive report, and export a self-contained offline package for later review.

## What the tool does

vkXtract helps you move from scattered VK pages and API responses to a structured local case.

At a high level, the extension:

- identifies the current VK target while you browse
- stores extraction results locally per target
- builds an interactive live report inside the extension
- exports a self-contained offline package for later review
- preserves raw JSON sidecars for transparency and follow-up work
- supports English and Ukrainian UI/report localization

vkXtract is not a passive page scraper only. It combines page context, VK API access, structured local storage, enrichment workflows, and report generation into one analyst workflow.

## Core feature set

### 1. Target-aware extraction

The popup detects the active VK target and works against a target-specific local case.

That includes:

- user targets
- community/group targets
- stored case keys per target
- re-scan / refresh behaviour to align the popup with the current page target

### 2. Profile and network extraction

Depending on the target and available API access, vkXtract can extract:

- profile or community baseline details
- friends / members
- followers
- following / subscriptions
- communities / groups
- family / relatives structures where available

The aim is to preserve structured relationship and profile data for later analysis rather than just dumping raw responses.

### 3. Media extraction and enrichment

vkXtract supports media-oriented workflows for:

- photos
- videos
- clips
- related engagement where captured and available

The report can surface:

- media thumbnails and identifiers
- dates and metadata
- geolocation where present
- likes / comments / overlap views where relevant
- map views and hotspot-style visual context for located media

### 4. Wall snapshot and interaction analysis

The Wall workflow is snapshot-by-design.

You can control the wall extraction scope, including:

- maximum post count
- whether comments are included
- whether likes are included
- optional date/time range use

This supports a controlled, reviewable capture rather than an uncontrolled endless crawl.

### 5. Observed analysis

vkXtract includes an Observed workflow intended to help analysts review captured interaction evidence and linked activity patterns.

This surface is designed to support:

- interaction evidence review
- observed relationship/context building
- chart-based exploratory analysis from captured wall/media evidence

### 6. Live report

The extension can open a live interactive report page.

This report is the main analyst review surface and includes major sections such as:

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
- **offline HTML package** for later review

Exports are designed to preserve case context in a structured way, including:

- report shell
- runtime data payload
- raw JSON sidecars
- media evidence folders where supported by the workflow

ZIP packages should be extracted before opening the exported `report/index.html`.

### 8. Local-first storage model

vkXtract is built around a local case workflow.

The extension stores working data locally for reuse and review. It is intended to help users build, revisit, export, and manage per-target cases from inside the browser.

## What the tool is for

vkXtract is intended for:

- OSINT and investigative support
- research and analytical review
- lawful documentation of VK targets
- locally stored case building
- exportable working packages for later review

## What the tool is not

vkXtract is not:

- a guarantee of complete data collection
- a guarantee that VK will return all requested data
- a legal authority check
- an identity verification engine
- a replacement for analyst judgement
- a claim that every result is accurate, complete, current, or admissible

## Manual install from a release ZIP

This project is intended to be distributed as a downloadable archive that users manually add to Chrome or Chromium-based browsers in Developer Mode.

### Install steps

1. Download the release ZIP.
2. Extract the ZIP to a normal folder on disk.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted extension folder — the folder that contains `manifest.json` at its top level.
7. Pin the extension if desired.

Important:

- Do not select the outer ZIP file directly.
- Do not select the wrong parent folder.
- The folder you choose must contain `manifest.json` in its root.

## Build from source

If you are building the extension yourself from this repository:

```bash
npm ci
npm run build

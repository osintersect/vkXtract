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

# VK Account and Access Token Setup

This guide explains, in simple terms, how a user can:

1. create a VK account
2. get a VK access token
3. paste that token into vkXtract
4. handle the token safely

This guide is written for vkXtract users who are installing the extension manually and need a practical token setup path.

---

## What this token is for

vkXtract uses a **VK user access token** to make VK API requests on behalf of the user.

Without a token, the extension can still detect some page context, but API-backed extraction and enrichment will be limited or unavailable.

Treat the token like a password:

- do not share it publicly
- do not post it in screenshots
- do not commit it to GitHub
- revoke it if you think it has been exposed

---

## Part 1 — Create a VK account

If you already have a VK account, skip to the next section.

### Step 1 — Go to VK

Open VK in your browser.

### Step 2 — Start sign-up

Choose the option to create a new account.

### Step 3 — Enter your details

Fill in the required registration details.

This may include items such as:

- first name
- last name
- date of birth
- phone number or other account verification details

### Step 4 — Verify the account

Complete any verification step VK requires.

### Step 5 — Sign in

After registration, sign in to the account you want to use with vkXtract.

---

## Part 2 — Choose how to get a token

There are two practical ways to get a VK token for vkXtract:

### Option A — Recommended
Use a VK application and OAuth flow.

This is the cleaner and more formal method.

### Option B — Easier shortcut
Use a token helper flow such as `vkhost.github.io`.

This is often faster for end users, but it is still a convenience route. If you use a third-party helper or third-party app profile such as VFeed or Kate Mobile, do so at your own risk.

---

## Part 3 — Recommended method: create a VK app and get a token through OAuth

### Step 1 — Open VK developer/app management

Go to VK's developer or application management area while signed in to your VK account.

### Step 2 — Create an application

Create a VK application for your own use.

The exact labels in VK's interface may change over time, but the general aim is:

- create an app
- save it
- note the **App ID** or **Client ID**

### Step 3 — Build the OAuth URL

Replace `YOUR_APP_ID` in the URL below with your actual VK app/client ID:

```text
https://oauth.vk.com/authorize?client_id=YOUR_APP_ID&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,groups,photos,video,wall,stories,offline&response_type=token&v=5.199
```

### Step 4 — Open the URL while signed in to VK

Paste that URL into the browser while logged in to the VK account you want to authorize.

### Step 5 — Approve access

VK should show a consent/allow screen.

Approve the requested access.

### Step 6 — Copy the token from the redirect URL

After approval, VK redirects you to a URL that looks something like this:

```text
https://oauth.vk.com/blank.html#access_token=YOUR_TOKEN_HERE&expires_in=0&user_id=123456789
```

Copy only the part after:

```text
access_token=
```

and before the next:

```text
&
```

That copied value is your token.

### Step 7 — Paste the token into vkXtract

Open the vkXtract popup.

Paste the token into the token field and save it.

---

## Part 4 — Easier method: use `vkhost.github.io`

This is the faster user-friendly method and is often the easiest route for non-technical users.

### Step 1 — Visit the token helper site

Open:

```text
https://vkhost.github.io/
```

### Step 2 — Choose an application

Pick an application from the list shown by the helper.

Some users choose app profiles such as:

- VFeed
- Kate Mobile

You may also use another available app or service.

### Step 3 — Click the app

Click the application you want to use.

### Step 4 — Approve access

Click **Continue as**, **Allow**, or the equivalent approval button.

### Step 5 — Copy the token from the final URL

After approval, the browser URL will include a token.

Copy the part starting after:

```text
access_token=
```

and ending before:

```text
&expires_in
```

### Step 6 — Paste it into vkXtract

Open the extension popup.

Paste the token into the token field and save it.

---

## Part 5 — Which method should users choose?

### Use the VK app/OAuth method if:

- you want the cleaner and more formal setup path
- you are documenting the process publicly
- you want to avoid relying on third-party helper pages

### Use the `vkhost` method if:

- you want the fastest setup route
- you are helping a non-technical user
- you understand this is a convenience method

For public project documentation, it is sensible to present the VK app/OAuth method first and the `vkhost` method as an optional shortcut.

---

## Part 6 — How to paste the token into vkXtract

### Step 1 — Open the extension popup

Click the vkXtract icon in the browser extension bar.

### Step 2 — Find the token field

Locate the field where the VK access token is entered.

### Step 3 — Paste the token

Paste the copied token value into the field.

### Step 4 — Save it

Save the token.

### Step 5 — Refresh or rescan the target page

If needed, refresh the popup or rescan the current VK target page so the extension begins using the saved token.

---

## Part 7 — Token safety

A VK token should be treated as sensitive credential material.

### Do:

- keep it private
- store it only where needed
- remove it when no longer needed
- revoke it if you believe it has been exposed

### Do not:

- paste it into GitHub issues
- include it in screenshots or screen recordings
- share it in chats or emails
- leave it in public notes or text files

---

## Part 8 — How to revoke or replace a token

If you think a token has been exposed:

1. remove it from vkXtract
2. revoke the app authorization or token from the VK side if possible
3. if necessary, change the VK account password
4. generate a new token
5. paste the new token into vkXtract

---

## Part 9 — Common problems

### Problem: I approved access but do not know what to copy

Copy only the token value itself.

Do **not** copy the whole URL unless you are storing it temporarily for extraction.

Correct idea:

```text
access_token=THIS_PART_ONLY
```

### Problem: The token does not work

Possible reasons include:

- the token was copied incorrectly
- the token was truncated
- the token was revoked
- the app/token does not have the required permissions
- VK restricted or changed access

Try generating a fresh token and pasting it again.

### Problem: I am worried about using a third-party helper

Use the VK app/OAuth method instead.

That is the better default choice for users who want the more formal route.


## Final note

The token setup route may change over time because VK interfaces, permissions, helper sites, and third-party app flows can change.

For that reason:

- keep the instructions practical
- avoid over-promising one exact interface path
- tell users to revoke tokens if exposed
- present third-party helper methods as optional, not as the only route

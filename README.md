# Spellstage

An independent spelling game inspired by the Practice, Competition, and Game Show modes in Merriam-Webster's Spell-Jam. It adds adaptive review, learner profiles, an original progressive Challenge mode, and three appearance themes. Original interface, definitions, and example sentences; no original game's assets or audio are bundled.

## Play

- **Practice:** Ten words, no timer, optional three-second preview, and spelling review.
- **Challenge:** Four tracks—Kids, Beginner, Rising, and Expert—with increasing word counts, shorter timers, passing goals, limited chances, and one-to-three-star results.
- **Game Show:** Ten words, three chances. A miss, skip, or timeout uses a chance.
- **Competition:** Two to four players on one device, five turns per player, an untimed handoff, and final standings. Ties are shared wins.
- **Vocabulary paths:** Young Learner, Beginner English, School English, and Adult English each include 30 curated words. These are independent from timer intensity and appearance theme.
- **Adaptive review:** Each non-competition round mixes weak, due, and new words. An incorrect first answer gets a guided second try, followed by a letter-by-letter comparison and spelling note.
- Replay pronunciation, slow it down, or show an original definition or a sentence with the answer hidden.
- Tap the on-screen keyboard, or use a physical keyboard. Enter checks; Space replays; Escape pauses.
- Create up to eight learner profiles. Mastery, first-try accuracy, response time, recent sessions, settings, and custom word lists are stored locally on the device.
- The Progress view exports detailed CSV data and opens a printer-friendly report that browsers can save as PDF. Teachers and parents can import a CSV word list with `word`, `definition`, `sentence`, and `part` columns.
- The game pauses when the tab is hidden. Audio and accessibility preferences are saved on this device.
- **Themes:** Kids, Student, and Adult change the visual treatment without changing words, rules, or scoring. The selected theme and challenge track are saved on the device.
- **Installable:** The hosted site includes a web app manifest and service worker. After the first successful visit, the interface and word bank can open offline.

Speech uses the Web Speech API and the device's available English voices. Voice availability, quality, and whether it requires internet depend on the browser and operating system. If speech reports an error, the game shows a definition so play can continue. Offline voice playback is available only when the device has a suitable local English voice.

## GitHub Pages deployment

This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. Push the project to a public GitHub repository with `main` as the default branch, then open **Settings → Pages** and set **Source** to **GitHub Actions**. Each push builds, tests, and deploys the `dist/` PWA. Because all application URLs are relative, installation and offline caching also work from a project path such as `https://USERNAME.github.io/REPOSITORY/`.

## Sources

- Reference modes: https://www.iplay.com/en/games/merriam-websters-spell-jam/
- Pronunciation implementation: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- Word review links point to individual Merriam-Webster dictionary entries.

## Implementation

`dist/` is the complete static site, with no package installation or build step. `game.mjs` contains the testable game engine and adaptive selector, `words.mjs` the 120-word bank and four content paths, and `app.js` the interface, persistence, reports, and audio integration. `.openai/hosting.json` identifies the private Site.

For the downloaded ZIP, extract it and open `dist/index.html` directly. The generated `app.bundle.js` avoids local-module restrictions. Installation and automatic offline caching require the hosted HTTPS version; direct local opening still runs the game and saves progress in the browser.

The page feature-detects WebMCP and exposes `get_spelling_game_state`, `start_spelling_game`, `submit_spelling_answer`, and `set_spelling_theme`. WebMCP is optional and does not change normal browser play.

## Verification

The engine tests cover unique words, all four content paths and Challenge tracks, adaptive weak-word selection, scoring, pause/resume, timeouts, elimination, complete practice sessions, multiplayer rotation, and tied scores. JavaScript syntax, PWA metadata, and local asset references are also checked. Pronunciation still requires validation on each target device because browser and installed-voice behavior varies.

# Dots and Hexes

_Draw two. Close a hex. Go again._ (working tagline)

Two-player dots-and-boxes on hexes; every move draws two lines. Prototyped as a single HTML artifact in claude.ai,
now a SvelteKit app with Triangula's structure and flow, but its own look: paper and pencil, like the classic
pre-computer game. A green graph pad, one handwriting font (Architects Daughter, bundled in `src/lib/fonts`),
graphite lines and dots, blue (player 1) and orange (player 2) colored pencil, yellow highlighter, white index
cards taped on for the launcher and prompts. No images except the BMG splash. The approved mock-ups are in
`mockups/paper-pencil/` (static HTML and `paper.css`).

## Screens and flow (as in Triangula)

Splash (BMG) → Home (title, tagline, rules, "play with friend" / "play against ai") → Launcher (size 7/13/19, each with a pencil sketch of its board at one scale;
robot level easy / not easy / hard / killer; ids `easy medium hard killer`) → Game page: stats row, scoreboard (avatar, score, pie, score, avatar), board,
message band, prompts, toolbar (back, resign, reset stats, sfx, music).

- Avatars are colored-pencil hexagons that rock on their turn, with a pencil swoosh under them. Robot avatars from Triangula are not
  copied; the robot's hexagon shows its level as 1–4 pips plus the level name.
- Before the first line, tapping a player makes them go first. A robot made to go first waits for the Start prompt.
- No hints. Selecting a dot previews its moves as dashed graphite lines.
- Stats and the unfinished game are stored per mode (opponent, size, level). No undo, as in Triangula.
- Sound effects and music are Triangula's (`src/lib/sounds`): taps, a pencil sound per player for each line, a chime
  per player for each claim, dice for a new game, a fast "won" chime (rate 2) when the game goes to single lines (its message is highlighted too), win / lose / draw
  chimes. The music starts at the launcher's play
  (the first tap that may start audio) and pauses while the window is in the background.

## Files

- `src/engine.js` — pure geometry and rules: `boardOf(size)`, `legalMoves`, `claimsIf`, `applyMove`, `deadDots`, `scores`.
  `drawn[e]` / `owner[h]` hold the player (1 or 2), or -1.
- `src/ai.js` — `chooseMove(board, drawn, level)`: easy / medium / hard, ported from the prototype, and killer:
  hard plus a perfect endgame (with `SOLVE_LINES` (20) or fewer lines left, an exact alpha-beta search).
- `src/sound.svelte.js` — Triangula's sound module (Howler): `_sound` (`sfx`, `music` on/off, saved with the mode),
  `sfx(name)` from the sprite, `tap`, `plop`, `whoosh`, `playMusic`.
- `src/service-worker.js` — offline play: every built and static file except the music is cached per build on
  install; the music is cached the first time it is fetched, in a `media` cache that outlives builds. Pages go to
  the network first, then the cache. Off in the itch.io build.
- `src/shared.svelte.js` — the store `ss`: screens, mode, stats, game, robot turns, tap hit-testing, localStorage.
- `src/Board.svelte` — the SVG board, in hex units. Lines are hand-drawn (each bows a little and runs past its
  dots, fixed per line); claimed hexes are colored-pencil scribbles; the last move is pressed hard (`--last`), except once the game is over; the
  selected dot gets a pencil loop in the mover's color. Dots out of play (`deadDots`) are half erased; all drawn
  lines stay. It keeps its own copies of the pencil filters and fills, scaled to hex units by `k` (one pixel).
- `src/Defs.svelte` — the shared SVG filters (`#pencil`, `#crayon`, `#grain`), colored-pencil fills
  (`#fill1/2/3`) and doodles (`#underline2`, `#swoosh`), in pixels; mounted once in `+page.svelte`.
- Colors are tokens in `routes/+layout.svelte` (`--bg`, `--ink`, `--line`, `--last`, `--p1`, `--p2`, `--p2-text`,
  `--friend`, `--gold`, `--desk` (also the theme color in `app.html` and the manifest), …), with the global `.hl` (highlighter) and `.card` (taped index card) classes.
- The rest follow Triangula's components: `Home`, `Launcher`, `Game Page`, `Stats`, `Scoreboard`, `Avatar`, `Pie`,
  `Message`, `Prompt`, `Toolbar`, `Splash`, `Frame` (the graph pad). `Button.svelte` is the one plain handwritten
  button (toolbar, launcher, prompts; it taps; a toggle passes `alt`, its other label, so it keeps one width); `Hex.svelte` draws the hexagon icons (`color` p1 / p2 / friend).

## Build (as in Triangula)

- `npm run build` — the normal build, for Vercel (`@sveltejs/adapter-vercel`).
- Static build (into `build/`): in `svelte.config.js` switch to `adapterStatic()`, and in `src/routes/+layout.js`
  uncomment `prerender = true`.
- `npm run build:itch` — `scripts/build-itch.js` (Triangula's, plus `icons` in its drop list): a static build in Vite's
  `itch` mode into `build-itch/`, without the manifest, install icons and app-install head tags, zipped as
  `build-itch/bitch.zip` to upload.

## Rules (agreed in the prototype)

- A move is two undrawn lines meeting at a dot; one of its three dots (either end or the
  middle) must already touch a drawn line (first move free), so drawn lines stay one connected network.
- Closing a hex earns another move.
- When no pair move is left, single lines; one earns another move only by closing two hexes at once.
- Against the robot, the robot is player 2.
- Prototype options that are fixed for now (not in the UI): rule "both", must-touch on, no starting lines, no traces.

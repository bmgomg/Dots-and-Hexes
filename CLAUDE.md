# Dots and Hexes

_Two lines a move. Close a hex, go again._ (working tagline)

Two-player dots-and-boxes on hexes; every move draws two lines. Prototyped as a single HTML artifact in claude.ai,
now a SvelteKit app with Triangula's structure and flow, but not its look: plain text buttons, one font
(Roboto Condensed), no images except the BMG splash. Board colors are Triangula's. No theme of its own yet.

## Screens and flow (as in Triangula)

Splash (BMG) → Home (title, tagline, rules, "play with friend" / "play against ai") → Launcher (size 7/13/19;
robot level easy / not easy / hard / harder; ids `easy medium hard harder`) → Game page: stats row, scoreboard (avatar, score, pie, score, avatar), board,
message band, prompts, toolbar (back, resign, reset stats, hints).

- Avatars are plain hexagons in the player colors and spin on their turn. Robot avatars from Triangula are not
  copied; the robot's hexagon shows its level as 1–4 pips plus the level name.
- Before the first line, tapping a player makes them go first. A robot made to go first waits for the Start prompt.
- Hints show the moves that would close a hex as gold dashes (the selected-dot preview is blue), like Triangula's claiming-move hints.
- Stats and the unfinished game are stored per mode (opponent, size, level). No undo, as in Triangula.
- No sound or music yet.

## Files

- `src/engine.js` — pure geometry and rules: `boardOf(size)`, `legalMoves`, `claimsIf`, `applyMove`, `deadDots`, `scores`.
  `drawn[e]` / `owner[h]` hold the player (1 or 2), or -1.
- `src/ai.js` — `chooseMove(board, drawn, level)`: easy / medium / hard, ported from the prototype, and harder:
  hard plus a perfect endgame (with `SOLVE_LINES` (20) or fewer lines left, an exact alpha-beta search).
- `src/shared.svelte.js` — the store `ss`: screens, mode, stats, game, robot turns, tap hit-testing, localStorage.
- `src/Board.svelte` — the SVG board. Colors are Triangula's (`--fill1/2`, `--p1/2`, orange last move, lime dots).
  Dots out of play (`deadDots`) fade away, as in Triangula; all drawn lines stay.
- The rest follow Triangula's components: `Home`, `Launcher`, `Game Page`, `Stats`, `Scoreboard`, `Avatar`, `Pie`,
  `Message`, `Prompt`, `Toolbar`, `Splash`, `Frame`. `Button.svelte` is the one plain button (toolbar, launcher,
  prompts); `Hex.svelte` draws the hexagon icons.

## Rules (agreed in the prototype)

- A move is two undrawn lines meeting at a dot; one end dot must already touch a drawn line (first move free).
- Closing a hex earns another move.
- When no pair move is left, single lines; one earns another move only by closing two hexes at once.
- Against the robot, the robot is player 2.
- Prototype options that are fixed for now (not in the UI): rule "both", must-touch on, no starting lines, no traces.

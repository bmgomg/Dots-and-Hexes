# Dots and Hexes

Two-player dots-and-boxes on hexes; every move draws two lines. Prototyped as a single HTML artifact in claude.ai,
now a SvelteKit app scaffolded from Triangula (configs, palette, fonts). No theme or fancy UI yet.

## Files

- `src/engine.js` — pure geometry and rules: `boardOf(size)` (7, 13, 19 hexes), `legalMoves`, `claimsIf`, `applyMove`, `scores`.
  `drawn[e]` / `owner[h]` hold the player (1 or 2), or -1.
- `src/ai.js` — `chooseMove(board, drawn, level)`: easy / medium / hard, ported from the prototype.
- `src/shared.svelte.js` — the store `ss`: mode, game, undo history, tap hit-testing, robot turns, localStorage.
- `src/Board.svelte` — the SVG board. Colors are Triangula's (`--fill1/2`, `--p1/2`, orange last move, lime dots).
  Dots out of play (`deadDots` in the engine) get Triangula's disabled look; all drawn lines stay.

## Rules (agreed in the prototype)

- A move is two undrawn lines meeting at a dot; one end dot must already touch a drawn line (first move free).
- Closing a hex earns another move.
- When no pair move is left, single lines; one earns another move only by closing two hexes at once.
- Player 1 always starts; against the robot, the robot is player 2.
- Prototype options that are fixed for now (not in the UI): rule "both", must-touch on, no starting lines, no traces, hints on.

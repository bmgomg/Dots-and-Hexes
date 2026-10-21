# Dots and Hexes

_Draw two. Close a hex. Go again._ (working tagline)

Dots and boxes on a hex board: every move draws two connected lines at once.

Built with SvelteKit, scaffolded from Triangula and using its board colors. No theme yet.

## Rules

- Tap a dot, then a dot two steps away: both lines between them get drawn. Neither may be drawn already.
- The path must already touch a line, at either end or in the middle (the first move is free).
- Closing a hex claims it and earns another move.
- When no two-line move is left, players draw single lines. Then you move again only if your line closes two hexes at once.
- When every line is drawn, more hexes wins.

## Develop

```sh
npm install
npm run dev     # http://localhost:1007
npm run lint
npm run build
```

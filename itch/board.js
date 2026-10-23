// Draws a Dots and Hexes board as the game does (src/Board.svelte): hand-drawn graphite lines that run a little
// past their dots and bow, colored-pencil scribbles for claimed hexes, the last move pressed hard, dots out of
// play half erased. Also the shared pixel-sized defs (pencil filters, underline) the pages use.
// Loaded as a module from file://, so the renderer needs --allow-file-access-from-files (render.sh passes it).
import { applyMove, boardOf, claimsIf, deadDots, emptyGame, legalMoves } from '../src/engine.js';

const NS = 'http://www.w3.org/2000/svg';

const add = (parent, tag, attrs = {}) => {
	const el = document.createElementNS(NS, tag);
	for (const key in attrs) el.setAttribute(key, attrs[key]);
	parent.appendChild(el);
	return el;
};

// the pixel-sized defs of src/Defs.svelte that the title's underline and the grain use
export const addDefs = () => {
	const svg = add(document.body, 'svg', { width: 0, height: 0, style: 'position:absolute' });
	svg.innerHTML = `<defs>
		<filter id="pencil" x="-10%" y="-10%" width="120%" height="120%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="grain">
			<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
			<feComponentTransfer><feFuncA type="table" tableValues="0 0.06" /></feComponentTransfer>
		</filter>
		<symbol id="underline2" viewBox="0 0 100 12" preserveAspectRatio="none">
			<path class="u1" d="M3 4 Q50 1 97 3" />
			<path class="u2" d="M10 10 Q52 7 90 9" />
		</symbol>
	</defs>`;
};

// A seeded random number generator, so a game plays out the same on every render.
const rng = (seed) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Plays a game like a fair robot: it closes a hex when it can, otherwise picks a move that leaves the other
// player nothing to close, if there is one. Returns every position, from the empty board on.
export const playGame = (size, seed, moves = Infinity) => {
	const bd = boardOf(size);
	const random = rng(seed);
	const pick = (arr) => arr[Math.floor(random() * arr.length)];
	const games = [emptyGame(size)];

	while (games.length <= moves && !games.at(-1).over) {
		const g = games.at(-1);
		const d = g.drawn.slice();
		const legal = legalMoves(bd, d);
		const claiming = legal.filter((mv) => claimsIf(bd, d, mv.es) > 0);
		let mv = claiming.length ? pick(claiming) : null;

		if (!mv) {
			const safe = legal.filter((m) => {
				m.es.forEach((e) => (d[e] = 9));
				const gives = legalMoves(bd, d).some((o) => claimsIf(bd, d, o.es) > 0);
				m.es.forEach((e) => (d[e] = -1));
				return !gives;
			});
			mv = pick(safe.length ? safe : legal);
		}

		games.push(applyMove(bd, g, mv));
	}

	return games;
};

// Fixed noise in [-0.5, 0.5) per line, so a line keeps its wobble (as in Board.svelte)
const wob = (i, j) => {
	const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
	return s - Math.floor(s) - 0.5;
};

// Draws game g on svg, which is width px wide (its height follows the board's shape).
// For animation: grow (0 to 1) draws the last move's lines along its path, as the pencil goes from dot to
// dot, and pop (0 to 1) brings in the hexes it closed, growing from 0.4 as in the game.
export const drawBoard = (svg, g, width, { last = true, grow = 1, pop = 1 } = {}) => {
	const bd = boardOf(g.size);
	const [x0, y0, vw, vh] = bd.view;
	const k = vw / width;
	const n = (x) => +x.toFixed(4);
	svg.setAttribute('viewBox', bd.view.join(' '));
	Object.assign(svg.style, { width: width + 'px', height: (width * vh) / vw + 'px', overflow: 'visible' });
	svg.replaceChildren();

	const defs = add(svg, 'defs');
	defs.innerHTML = `
		<filter id="b-pencil" x="-5%" y="-5%" width="110%" height="110%">
			<feTurbulence type="fractalNoise" baseFrequency="${0.9 / k}" numOctaves="2" seed="9" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="${2.2 * k}" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="b-crayon" x="-5%" y="-5%" width="110%" height="110%">
			<feTurbulence type="fractalNoise" baseFrequency="${1.4 / k}" numOctaves="2" seed="5" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="${4 * k}" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		${[1, 2]
			.map(
				(
					p
				) => `<pattern id="b-fill${p}" patternUnits="userSpaceOnUse" width="${10 * k}" height="${6 * k}" patternTransform="rotate(${p === 1 ? 24 : -24})">
			<g transform="scale(${k})" style="color: var(--p${p})">
				<rect width="10" height="6" fill="currentColor" fill-opacity="0.22" />
				<path d="M0 5 L2.5 1 L5 5 L7.5 1 L10 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" opacity="0.65" />
			</g>
		</pattern>`
			)
			.join('')}`;

	const pts = (vs) => vs.map((i) => `${bd.verts[i].x},${bd.verts[i].y}`).join(' ');

	const hexes = add(svg, 'g', { filter: 'url(#b-crayon)' });
	const fresh = new Set(g.last?.hexes ?? []);

	g.owner.forEach((o, i) => {
		if (o <= 0 || (fresh.has(i) && pop <= 0)) return;
		const poly = add(hexes, 'polygon', { points: pts(bd.hexes[i].vs), fill: `url(#b-fill${o})` });

		if (fresh.has(i) && pop < 1) {
			const c = bd.hexes[i].vs.reduce((m, v) => ({ x: m.x + bd.verts[v].x / 6, y: m.y + bd.verts[v].y / 6 }), { x: 0, y: 0 });
			const s = 0.4 + 0.6 * pop;
			poly.setAttribute('transform', `translate(${c.x} ${c.y}) scale(${s}) translate(${-c.x} ${-c.y})`);
			poly.setAttribute('opacity', pop);
		}
	});

	const pencil = add(svg, 'g', { filter: 'url(#b-pencil)' });
	const lastEdges = new Set(last && !g.over ? (g.last?.edges ?? []) : []);
	// the last move's lines in drawing order, each with the dot it starts from
	const order = (g.last?.edges ?? []).map((e, j) => ({ e, from: g.last.path[j] }));

	bd.edges.forEach((e, i) => {
		if (g.drawn[i] < 0) return;
		const a = bd.verts[e.a];
		const b = bd.verts[e.b];
		const ux = b.x - a.x;
		const uy = b.y - a.y;
		const o1 = (1.5 + 2 * wob(i, 0)) * k;
		const o2 = (1.5 + 2 * wob(i, 1)) * k;
		const x1 = a.x - ux * o1 + wob(i, 2) * k;
		const y1 = a.y - uy * o1 + wob(i, 3) * k;
		const x2 = b.x + ux * o2 + wob(i, 4) * k;
		const y2 = b.y + uy * o2 + wob(i, 5) * k;
		const bow = 5 * wob(i, 6) * k;
		const hard = lastEdges.has(i);
		const j = order.findIndex((x) => x.e === i);
		// how much of this line is drawn yet: the move's lines go one after the other
		const part = j < 0 ? 1 : Math.min(1, Math.max(0, grow * order.length - j));

		if (part <= 0) return;

		const path = add(pencil, 'path', {
			d: `M${n(x1)} ${n(y1)}Q${n((x1 + x2) / 2 - uy * bow)} ${n((y1 + y2) / 2 + ux * bow)} ${n(x2)} ${n(y2)}`,
			fill: 'none',
			style: `stroke: var(${hard ? '--last' : '--line'})`,
			'stroke-width': (hard ? 3.4 : 2) * k,
			'stroke-linecap': 'round',
			opacity: hard ? 1 : 0.9
		});

		if (part < 1) {
			// drawn from the dot the move starts at: from e.a forward, or from e.b back
			path.setAttribute('pathLength', 1);
			path.setAttribute('stroke-dasharray', `${part} 2`);
			if (order[j].from !== e.a) path.setAttribute('stroke-dashoffset', -(1 - part));
		}
	});

	const dead = deadDots(bd, g);
	bd.verts.forEach((v, i) =>
		add(pencil, 'circle', { cx: v.x, cy: v.y, r: 3.6 * k, style: 'fill: var(--ink)', opacity: dead.has(i) ? 0.13 : 1 })
	);

	return { x0, y0, vw, vh };
};

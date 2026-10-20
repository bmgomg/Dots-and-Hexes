// Board geometry and rules. Pure: nothing here touches the game state.
//
// A board is a patch of hexes with side 1, so neighboring dots are 1 apart. Lines are the
// hex edges. drawn[e] is the player (1 or 2) who drew edge e, or -1; owner[h] likewise.

const SQ3 = Math.sqrt(3);

// Hex-shaped boards in axial coordinates. 13 = the 19 board without its 6 corner hexes.
const hexCells = (n) => {
	const out = [];

	for (let q = -n; q <= n; q++) {
		for (let r = -n; r <= n; r++) {
			if (Math.abs(q + r) <= n) {
				out.push([q, r]);
			}
		}
	}

	return out;
};

const isCorner = ([q, r]) => Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) === 2 && (q === 0 || r === 0 || q + r === 0);

const CELLS = {
	7: () => hexCells(1),
	13: () => hexCells(2).filter((c) => !isCorner(c)),
	19: () => hexCells(2)
};

export const SIZES = Object.keys(CELLS).map(Number);

export const UNDRAWN = -1;

// Marks a line as drawn while a move is only being tried out.
const TRIAL = 9;

const build = (size) => {
	const verts = [];
	const edges = [];
	const hexes = [];
	const pairs = [];
	const vmap = new Map();
	const emap = new Map();

	const vid = (x, y) => {
		const k = `${Math.round(x * 1000)},${Math.round(y * 1000)}`;

		if (!vmap.has(k)) {
			vmap.set(k, verts.length);
			verts.push({ x, y, adj: [] });
		}

		return vmap.get(k);
	};

	const eid = (a, b) => {
		const lo = Math.min(a, b);
		const hi = Math.max(a, b);
		const k = `${lo}-${hi}`;

		if (!emap.has(k)) {
			const i = edges.length;
			emap.set(k, i);
			edges.push({ a: lo, b: hi, hexes: [] });
			verts[lo].adj.push({ v: hi, e: i });
			verts[hi].adj.push({ v: lo, e: i });
		}

		return emap.get(k);
	};

	CELLS[size]().forEach(([q, r], h) => {
		const cx = SQ3 * (q + r / 2);
		const cy = 1.5 * r;
		const vs = [];
		const es = [];

		for (let i = 0; i < 6; i++) {
			const t = (Math.PI / 180) * (60 * i - 30);
			vs.push(vid(cx + Math.cos(t), cy + Math.sin(t)));
		}

		for (let i = 0; i < 6; i++) {
			const e = eid(vs[i], vs[(i + 1) % 6]);
			edges[e].hexes.push(h);
			es.push(e);
		}

		hexes.push({ vs, es });
	});

	// every two-line path: a dot m and two of its neighbors a and c
	verts.forEach((v, m) => {
		for (let i = 0; i < v.adj.length; i++) {
			for (let j = i + 1; j < v.adj.length; j++) {
				const A = v.adj[i];
				const C = v.adj[j];
				pairs.push({ a: A.v, m, c: C.v, es: [A.e, C.e] });
			}
		}
	});

	const xs = verts.map((v) => v.x);
	const ys = verts.map((v) => v.y);
	const pad = 0.45;
	const x0 = Math.min(...xs) - pad;
	const y0 = Math.min(...ys) - pad;
	const view = [x0, y0, Math.max(...xs) + pad - x0, Math.max(...ys) + pad - y0];

	return { size, verts, edges, hexes, pairs, view };
};

const boards = new Map();

export const boardOf = (size) => {
	if (!boards.has(size)) {
		boards.set(size, build(size));
	}

	return boards.get(size);
};

export const emptyGame = (size) => {
	const bd = boardOf(size);

	return {
		size,
		drawn: new Array(bd.edges.length).fill(UNDRAWN),
		owner: new Array(bd.hexes.length).fill(UNDRAWN),
		turn: 1,
		last: null,
		over: false
	};
};

// Pair moves: two undrawn lines that meet at a dot, and one of the two end dots must already
// touch a drawn line (the first move is free). When no pair move is left, single lines,
// preferring ones that touch a drawn line.
export const legalMoves = (bd, drawn) => {
	const out = [];
	const restrict = drawn.some((x) => x >= 0);
	const touched = (v) => bd.verts[v].adj.some((x) => drawn[x.e] >= 0);
	const ok = (a, c) => !restrict || touched(a) || touched(c);

	for (const p of bd.pairs) {
		if (drawn[p.es[0]] < 0 && drawn[p.es[1]] < 0 && ok(p.a, p.c)) {
			out.push({ a: p.a, c: p.c, path: [p.a, p.m, p.c], es: p.es });
		}
	}

	if (out.length) {
		return out;
	}

	const singles = (check) =>
		bd.edges.forEach((e, i) => {
			if (drawn[i] < 0 && check(e.a, e.b)) {
				out.push({ a: e.a, c: e.b, path: [e.a, e.b], es: [i], single: true });
			}
		});

	singles(ok);

	if (!out.length) {
		singles(() => true);
	}

	return out;
};

export const tryLines = (drawn, es) => es.forEach((e) => (drawn[e] = TRIAL));

export const untryLines = (drawn, es) => es.forEach((e) => (drawn[e] = UNDRAWN));

// How many hexes drawing these lines would close. Leaves drawn as it found it.
export const claimsIf = (bd, drawn, es) => {
	tryLines(drawn, es);

	const seen = new Set();
	let n = 0;

	for (const e of es) {
		for (const h of bd.edges[e].hexes) {
			if (seen.has(h)) {
				continue;
			}

			seen.add(h);

			if (bd.hexes[h].es.every((x) => drawn[x] >= 0)) {
				n++;
			}
		}
	}

	untryLines(drawn, es);

	return n;
};

// The game after the player to move plays mv. Returns a new game; the old one is untouched.
export const applyMove = (bd, game, mv) => {
	const p = game.turn;
	const drawn = game.drawn.slice();
	const owner = game.owner.slice();

	mv.es.forEach((e) => (drawn[e] = p));

	const closed = [];

	for (const e of mv.es) {
		for (const h of bd.edges[e].hexes) {
			if (owner[h] < 0 && bd.hexes[h].es.every((x) => drawn[x] >= 0)) {
				owner[h] = p;
				closed.push(h);
			}
		}
	}

	// Pair moves: closing any hex earns another move. Single-line moves: only closing two at once does.
	const again = closed.length >= (mv.single ? 2 : 1);

	return {
		size: game.size,
		drawn,
		owner,
		turn: again ? p : 3 - p,
		last: { path: mv.path, player: p, edges: mv.es.slice(), hexes: closed, single: !!mv.single },
		over: drawn.every((x) => x >= 0)
	};
};

// Dots no move can start, pass or end at any more: every line at them is drawn.
export const deadDots = (bd, game) => {
	const out = new Set();

	bd.verts.forEach((v, i) => {
		if (v.adj.every((x) => game.drawn[x.e] >= 0)) {
			out.add(i);
		}
	});

	return out;
};

export const scores = (game) => {
	const sc = [0, 0, 0];
	game.owner.forEach((o) => o > 0 && sc[o]++);

	return sc;
};

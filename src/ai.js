import { claimsIf, legalMoves, tryLines, untryLines } from './engine';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Hexes the player to move can grab in one turn, taking the biggest close each time.
const greedyRun = (bd, d) => {
	const marked = [];
	let total = 0;

	for (;;) {
		let bm = null;
		let bc = 0;

		for (const o of legalMoves(bd, d)) {
			const c = claimsIf(bd, d, o.es);

			if (c > bc) {
				bc = c;
				bm = o;
			}
		}

		if (!bm) {
			break;
		}

		total += bc;
		tryLines(d, bm.es);
		marked.push(...bm.es);

		if (bm.single && bc < 2) {
			break;
		}
	}

	untryLines(d, marked);

	return total;
};

// Hard: take hexes when the turn continues; otherwise give away the fewest over the opponent's whole turn.
const hardPick = (bd, d, moves) => {
	let cand = [];
	let bv = -Infinity;

	for (const mv of moves) {
		const c = claimsIf(bd, d, mv.es);
		let v;

		if (c > 0 && (!mv.single || c >= 2)) {
			v = c + 0.5;
		} else {
			tryLines(d, mv.es);
			v = c - greedyRun(bd, d);
			untryLines(d, mv.es);
		}

		if (v > bv + 1e-9) {
			bv = v;
			cand = [mv];
		} else if (Math.abs(v - bv) < 1e-9) {
			cand.push(mv);
		}
	}

	return pick(cand);
};

// killer switches from hardPick to an exact search once this few lines are left. Higher is
// stronger and slower. Against Hard, 20 won 55–67% of games (by board size), 24 won 67–82%.
const SOLVE_LINES = 20;

// Insurance for slow devices: past this the search gives up and hardPick moves instead.
const SOLVE_MS = 300;

const TIMEOUT = {};
const EXACT = 0;
const LOWER = 1;
const UPPER = 2;

// Exact play for the rest of the game: alpha-beta over the set of undrawn lines (a bitmask
// over just those lines) with a transposition table. A position's value is (hexes the player
// to move will still get) − (the other's). Returns null when there are too many lines or time runs out.
const solve = (bd, drawn) => {
	const local = [];
	const li = new Map();

	drawn.forEach((x, e) => {
		if (x < 0) {
			li.set(e, local.length);
			local.push(e);
		}
	});

	const n = local.length;

	if (n > SOLVE_LINES) {
		return null;
	}

	const full = (1 << n) - 1;
	const bit = (e) => 1 << li.get(e);
	const deadline = performance.now() + SOLVE_MS;

	// each open hex as the mask of its undrawn lines: it closes when they are all drawn
	const hexMask = bd.hexes.map((h) => h.es.reduce((m, e) => (li.has(e) ? m | bit(e) : m), 0));
	const hexesOf = (es) => [...new Set(es.flatMap((e) => bd.edges[e].hexes))].filter((h) => hexMask[h]);

	const pairs = [];

	for (const p of bd.pairs) {
		if (li.has(p.es[0]) && li.has(p.es[1])) {
			pairs.push({
				m: bit(p.es[0]) | bit(p.es[1]),
				a: p.a,
				mid: p.m,
				c: p.c,
				hs: hexesOf(p.es),
				move: { a: p.a, c: p.c, path: [p.a, p.m, p.c], es: p.es }
			});
		}
	}

	const singles = local.map((e, i) => {
		const { a, b } = bd.edges[e];
		return { m: 1 << i, a, c: b, hs: hexesOf([e]), single: true, move: { a, c: b, path: [a, b], es: [e], single: true } };
	});

	// the same rules as legalMoves, on masks: a dot touches a line drawn before the search or since
	const rootTouched = bd.verts.map((v) => v.adj.some((x) => drawn[x.e] >= 0));
	const adjMask = bd.verts.map((v) => v.adj.reduce((m, x) => (li.has(x.e) ? m | bit(x.e) : m), 0));
	const restrictRoot = drawn.some((x) => x >= 0);

	const moves = (u) => {
		const dl = full & ~u;
		const restrict = restrictRoot || dl !== 0;
		const ok = (...vs) => !restrict || vs.some((v) => rootTouched[v] || (adjMask[v] & dl) !== 0);
		const out = pairs.filter((x) => (u & x.m) === x.m && ok(x.a, x.mid, x.c));

		if (out.length) {
			return out;
		}

		out.push(...singles.filter((x) => u & x.m && ok(x.a, x.c)));

		return out.length ? out : singles.filter((x) => u & x.m);
	};

	const claims = (nu, mv) => mv.hs.filter((h) => (hexMask[h] & nu) === 0).length;

	const tt = new Map();
	let nodes = 0;

	const search = (u, alpha, beta) => {
		if (u === 0) {
			return 0;
		}

		if ((++nodes & 1023) === 0 && performance.now() > deadline) {
			throw TIMEOUT;
		}

		const hit = tt.get(u);

		if (hit !== undefined) {
			const v = (hit >> 2) - 64;
			const f = hit & 3;

			if (f === EXACT) {
				return v;
			}

			if (f === LOWER) {
				alpha = Math.max(alpha, v);
			} else {
				beta = Math.min(beta, v);
			}

			if (alpha >= beta) {
				return v;
			}
		}

		const a0 = alpha;

		// claiming moves first: they decide most cutoffs
		const next = moves(u).map((mv) => {
			const nu = u & ~mv.m;
			return { mv, nu, c: claims(nu, mv) };
		});

		next.sort((x, y) => y.c - x.c);

		let best = -Infinity;

		for (const { mv, nu, c } of next) {
			const again = c > 0 && (!mv.single || c >= 2);
			const v = again ? c + search(nu, alpha - c, beta - c) : c - search(nu, c - beta, c - alpha);

			best = Math.max(best, v);
			alpha = Math.max(alpha, v);

			if (alpha >= beta) {
				break;
			}
		}

		tt.set(u, ((best + 64) << 2) | (best <= a0 ? UPPER : best >= beta ? LOWER : EXACT));

		return best;
	};

	// At the root every move gets its exact value (windows just wide enough to tell a tie
	// from a loss), so equal moves can be picked at random.
	let bestV = -Infinity;
	let cand = [];

	try {
		for (const mv of moves(full)) {
			const nu = full & ~mv.m;
			const c = claims(nu, mv);
			const again = c > 0 && (!mv.single || c >= 2);
			const v = again ? c + search(nu, bestV - c - 1, 64) : c - search(nu, -64, c - bestV + 1);

			if (v > bestV) {
				bestV = v;
				cand = [mv];
			} else if (v === bestV) {
				cand.push(mv);
			}
		}
	} catch (e) {
		if (e === TIMEOUT) {
			return null;
		}

		throw e;
	}

	return pick(cand).move;
};

// Easy: takes any hex it can, otherwise random. Medium: also avoids giving a hex away on the next move.
// Hard: hardPick. killer: hardPick until the endgame, then exact play.
export const chooseMove = (bd, drawn, level) => {
	const d = drawn.slice();
	const moves = legalMoves(bd, d);
	let best = [];
	let bs = -1;

	for (const mv of moves) {
		const c = claimsIf(bd, d, mv.es);

		if (c > bs) {
			bs = c;
			best = [mv];
		} else if (c === bs) {
			best.push(mv);
		}
	}

	if (level === 'easy') {
		return bs > 0 ? pick(best) : pick(moves);
	}

	if (level === 'hard') {
		return hardPick(bd, d, moves);
	}

	if (level === 'killer') {
		return solve(bd, drawn) ?? hardPick(bd, d, moves);
	}

	if (bs > 0) {
		return pick(best);
	}

	let cand = [];
	let low = Infinity;

	for (const mv of moves) {
		tryLines(d, mv.es);

		let mx = 0;

		for (const o of legalMoves(bd, d)) {
			mx = Math.max(mx, claimsIf(bd, d, o.es));

			if (mx >= 3) {
				break;
			}
		}

		untryLines(d, mv.es);

		if (mx < low) {
			low = mx;
			cand = [mv];
		} else if (mx === low) {
			cand.push(mv);
		}
	}

	return pick(cand);
};

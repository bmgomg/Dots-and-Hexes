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

// Easy: takes any hex it can, otherwise random. Medium: also avoids giving a hex away on the next move.
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

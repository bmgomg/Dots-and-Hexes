import { chooseMove } from './ai';
import { APP_STATE, HUMAN, LEVELS, ROBOT, ROBOT_DELAY } from './const';
import { applyMove, boardOf, emptyGame, legalMoves, scores, SIZES } from './engine';
import { post } from './utils';

let robotTimer;

// Taps snap to the nearest dot that makes sense right now, in board units (dot spacing = 1).
const nearest = (bd, ids, p, maxR) => {
	let best = null;
	let bd2 = maxR * maxR;

	for (const i of ids) {
		const dx = bd.verts[i].x - p.x;
		const dy = bd.verts[i].y - p.y;
		const dd = dx * dx + dy * dy;

		if (dd < bd2) {
			bd2 = dd;
			best = i;
		}
	}

	return best;
};

class Store {
	mode = $state({ size: 19, opp: ROBOT, level: 'medium' });

	// Raw: the engine reads these arrays over and over, and every move replaces the game whole.
	game = $state.raw(null);
	history = $state.raw([]);

	sel = $state(null);

	// the last move was just played, so it animates; false after undo or reload
	fresh = $state(false);

	board = $derived(this.game && boardOf(this.game.size));
	legal = $derived(this.game && !this.game.over ? legalMoves(this.board, this.game.drawn) : []);
	scores = $derived(this.game ? scores(this.game) : [0, 0, 0]);
	robotTurn = $derived(this.mode.opp === ROBOT && this.game?.turn === 2 && !this.game.over);

	// dot -> [{ other, move }] for every legal move that starts or ends there
	movesFrom = $derived.by(() => {
		// built fresh on every change and never mutated after, so it needs no reactivity of its own
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const out = new Map();

		for (const mv of this.legal) {
			for (const [f, o] of [
				[mv.a, mv.c],
				[mv.c, mv.a]
			]) {
				if (!out.has(f)) {
					out.set(f, []);
				}

				out.get(f).push({ other: o, move: mv });
			}
		}

		return out;
	});

	names = $derived(this.mode.opp === ROBOT ? ['', 'You', 'Robot'] : ['', 'Player 1', 'Player 2']);

	canUndo = $derived(this.history.length > 0 && !this.robotTurn);

	newGame = () => {
		clearTimeout(robotTimer);
		this.game = emptyGame(this.mode.size);
		this.history = [];
		this.sel = null;
		this.fresh = false;
		this.persist();
	};

	play = (mv) => {
		this.history = [...this.history, this.game];
		this.game = applyMove(this.board, this.game, mv);
		this.sel = null;
		this.fresh = true;
		this.persist();
		this.maybeRobot();
	};

	// Against the robot, undo goes back to the last position where it was your move.
	undo = () => {
		clearTimeout(robotTimer);

		const h = this.history.slice();
		let g;

		do {
			g = h.pop();
		} while (this.mode.opp === ROBOT && g.turn === 2 && h.length);

		if (this.mode.opp === ROBOT && g.turn === 2) {
			this.maybeRobot();
			return;
		}

		this.history = h;
		this.game = g;
		this.sel = null;
		this.fresh = false;
		this.persist();
		this.maybeRobot();
	};

	maybeRobot = () => {
		clearTimeout(robotTimer);

		if (this.robotTurn) {
			robotTimer = post(() => this.play(chooseMove(this.board, this.game.drawn, this.mode.level)), ROBOT_DELAY);
		}
	};

	// p is a point in board units
	tapAt = (p) => {
		if (!this.game || this.game.over || this.robotTurn) {
			return;
		}

		const bd = this.board;
		const live = [...this.movesFrom.keys()];

		if (this.sel === null) {
			this.sel = nearest(bd, live, p, 0.7);
			return;
		}

		// Targets and the selected dot get a large catch area; they are never closer than 1 apart.
		const targets = this.movesFrom.get(this.sel) || [];
		const v = nearest(bd, [this.sel, ...targets.map((t) => t.other)], p, 0.85);

		if (v === this.sel) {
			this.sel = null;
		} else if (v !== null) {
			this.play(targets.find((t) => t.other === v).move);
		} else {
			this.sel = nearest(bd, live, p, 0.5);
		}
	};

	setMode = (key, value) => {
		if (this.mode[key] === value) {
			return;
		}

		this.mode[key] = value;

		if (key === 'level') {
			this.persist();
		} else {
			this.newGame();
		}
	};

	persist = () => {
		try {
			localStorage.setItem(APP_STATE, JSON.stringify({ mode: this.mode, game: this.game, history: this.history }));
		} catch {
			// private mode or storage full: the game still plays, it just won't survive a reload
		}
	};

	load = () => {
		let job = null;

		try {
			job = JSON.parse(localStorage.getItem(APP_STATE));
		} catch {
			// unreadable save: start fresh
		}

		if (job?.mode) {
			const { size, opp, level } = job.mode;
			this.mode = {
				size: SIZES.includes(size) ? size : 19,
				opp: opp === HUMAN ? HUMAN : ROBOT,
				level: LEVELS.includes(level) ? level : 'medium'
			};
		}

		const g = job?.game;

		if (g && g.size === this.mode.size && !g.over && g.drawn?.length === boardOf(g.size).edges.length) {
			this.game = g;
			this.history = job.history ?? [];
			this.sel = null;
			this.fresh = false;
			this.maybeRobot();
		} else {
			this.newGame();
		}
	};
}

export const ss = new Store();

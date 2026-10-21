import { chooseMove } from './ai';
import { APP_STATE, DX, HUMAN, LEVELS, MSG_SINGLES, MSG_START_TIP, ROBOT, WINNER_DRAW } from './const';
import { applyMove, boardOf, claimsIf, deadDots, emptyGame, legalMoves, scores, SIZES } from './engine';
import { post } from './utils';

export const newStats = () => ({ plays: 0, wins1: 0, wins2: 0, total: 0, best: 0 });

let moveTimer;

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
	// screens: home, then the launcher, then the game page under it
	home = $state(true);
	launcher = $state(false);
	prompt = $state(null);
	message = $state(null);
	scale = $state(1);

	showHints = $state(false);
	noStartTip = $state(false);

	mode = $state({ opp: ROBOT, size: 19, level: 'medium' });
	stats = $state(newStats());

	// Raw: the engine reads these arrays over and over, and every move replaces the game whole.
	game = $state.raw(null);

	sel = $state(null);

	// the robot's second dot, shown before its move lands
	to = $state(null);

	// the robot is between its two taps
	busy = $state(false);

	// the last move was just played, so it animates; false after a reload
	fresh = $state(false);

	board = $derived(this.game && boardOf(this.game.size));
	legal = $derived(this.game && !this.game.over && !this.game.resign ? legalMoves(this.board, this.game.drawn) : []);
	scores = $derived(this.game ? scores(this.game) : [0, 0, 0]);
	deadDots = $derived(this.game && deadDots(this.board, this.game));
	started = $derived(!!this.game?.drawn.some((x) => x >= 0));

	winner = $derived.by(() => {
		const g = this.game;

		if (!g) {
			return 0;
		}

		if (g.resign) {
			return 3 - g.resign;
		}

		if (!g.over) {
			return 0;
		}

		const [, s1, s2] = this.scores;

		return s1 > s2 ? 1 : s2 > s1 ? 2 : WINNER_DRAW;
	});

	robotTurn = $derived(this.mode.opp === ROBOT && this.game?.turn === 2 && !this.winner);

	// the robot was made to go first and waits for the Start prompt
	robotStart = $derived(this.robotTurn && !this.started && !this.busy);

	// moves that would close a hex, shown as hints
	claiming = $derived.by(() => {
		const d = this.game?.drawn.slice();
		return this.legal.filter((mv) => claimsIf(this.board, d, mv.es) > 0);
	});

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

	appKey = $derived(APP_STATE + ' • ' + JSON.stringify(this.mode));

	percent = (player) => (this.board ? Math.round((100 * this.scores[player]) / this.board.hexes.length) : 0);

	persistCommon = () => {
		const json = JSON.stringify({ mode: this.mode, showHints: this.showHints, noStartTip: this.noStartTip });
		localStorage.setItem(APP_STATE, json);
	};

	loadCommon = () => {
		const job = JSON.parse(localStorage.getItem(APP_STATE));

		if (job) {
			const { opp, size, level } = job.mode ?? {};

			this.mode = {
				opp: opp === HUMAN ? HUMAN : ROBOT,
				size: SIZES.includes(size) ? size : 19,
				level: LEVELS.includes(level) ? level : 'medium'
			};

			this.showHints = !!job.showHints;
			this.noStartTip = !!job.noStartTip;
		}
	};

	// stats and the game in progress are kept per mode
	persist = () => {
		localStorage.setItem(this.appKey, JSON.stringify({ stats: this.stats, game: this.game }));
	};

	// false when there is no unfinished game for this mode to go back to
	loadGame = () => {
		const job = JSON.parse(localStorage.getItem(this.appKey));

		this.stats = job?.stats ?? newStats();

		const g = job?.game;

		if (g && !g.over && !g.resign && g.size === this.mode.size && g.drawn?.length === boardOf(g.size).edges.length) {
			this.game = g;
			this.sel = null;
			this.fresh = false;
			return true;
		}

		return false;
	};

	newGame = () => {
		clearTimeout(moveTimer);
		this.busy = false;
		this.message = null;
		this.prompt = null;
		this.sel = null;
		this.to = null;
		this.fresh = false;
		this.game = emptyGame(this.mode.size);
		this.persist();
		this.maybeShowStartTip();
	};

	maybeShowStartTip = () => {
		if (!this.noStartTip && !this.started) {
			post(() => (this.message = MSG_START_TIP), 500);
		}
	};

	dismissStartTip = () => {
		if (this.message === MSG_START_TIP) {
			this.message = null;
		}
	};

	// Before the first line, tapping a player hands them the first move.
	switchFirst = () => {
		if (this.started || this.winner || this.busy) {
			return;
		}

		this.sel = null;
		this.game = { ...this.game, turn: 3 - this.game.turn };
		this.persist();

		this.dismissStartTip();
		this.noStartTip = true;
		this.persistCommon();
	};

	play = (mv) => {
		const wasSingle = this.legal[0]?.single;

		this.dismissStartTip();
		this.game = applyMove(this.board, this.game, mv);
		this.sel = null;
		this.to = null;
		this.fresh = true;

		if (this.winner) {
			this.onOver();
		} else if (!wasSingle && this.legal[0]?.single) {
			this.message = MSG_SINGLES;
		}

		this.persist();
		this.maybeRobot();
	};

	onOver = () => {
		const w = this.winner;

		this.updateStats();

		if (w === WINNER_DRAW) {
			this.message = 'it’s a draw!';
		} else if (this.mode.opp === ROBOT) {
			this.message = w === 1 ? 'you won!' : 'you lost';
		} else {
			this.message = `player ${w} won!`;
		}
	};

	updateStats = () => {
		const w = this.winner;

		this.stats.plays++;

		if (w === 1) {
			this.stats.wins1++;
		} else if (w === 2) {
			this.stats.wins2++;
		}

		if (!this.game.resign && this.mode.opp === ROBOT) {
			const percent = this.percent(1);
			this.stats.total += percent;
			this.stats.best = Math.max(this.stats.best, percent);
		}
	};

	resign = () => {
		const p = this.game.turn;

		this.prompt = null;
		this.sel = null;
		this.game = { ...this.game, resign: p };
		this.message = (this.mode.opp === HUMAN ? 'player ' + p : 'you') + ' resigned';
		this.updateStats();
		this.persist();
	};

	resetStats = () => {
		this.prompt = null;
		this.stats = newStats();
		this.persist();
	};

	// A robot that was asked to go first waits for the Start prompt instead.
	maybeRobot = () => {
		if (this.robotTurn && this.started && !this.busy) {
			this.doRobotMove();
		}
	};

	// Like a player: it taps one dot, then the other.
	doRobotMove = () => {
		const mv = chooseMove(this.board, this.game.drawn, this.mode.level);

		this.busy = true;
		this.dismissStartTip();

		moveTimer = post(() => {
			this.sel = mv.a;

			moveTimer = post(() => {
				this.to = mv.c;

				moveTimer = post(() => {
					this.busy = false;
					this.play(mv);
				}, 400);
			}, 600);
		}, 600);
	};

	// p is a point in board units
	tapAt = (p) => {
		if (!this.game || this.winner || this.robotTurn || this.prompt || this.busy) {
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
			// ring the other end first, then draw the path
			const mv = targets.find((t) => t.other === v).move;

			this.to = v;
			this.busy = true;

			moveTimer = post(() => {
				this.busy = false;
				this.play(mv);
			}, 300);
		} else {
			this.sel = nearest(bd, live, p, 0.5);
		}

		this.dismissStartTip();
	};
}

export const ss = new Store();

export const boardSize = () => DX - 20;

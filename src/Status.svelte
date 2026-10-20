<script>
	import { ROBOT } from './const';
	import { ss } from './shared.svelte';

	const robot = $derived(ss.mode.opp === ROBOT);

	// [text, player] pieces; a player's name is shown in their color
	const parts = $derived.by(() => {
		const g = ss.game;
		const nm = ss.names;
		const sc = ss.scores;
		const who = (p) => [nm[p], p];

		if (g.over) {
			if (sc[1] === sc[2]) {
				return [[`Tie game, ${sc[1]}–${sc[2]}.`]];
			}

			const w = sc[1] > sc[2] ? 1 : 2;
			const score = `${sc[w]}–${sc[3 - w]}`;

			if (robot) {
				return [[w === 1 ? `You win, ${score}.` : `Robot wins, ${score}.`]];
			}

			return [who(w), [` wins, ${score}.`]];
		}

		const last = g.last;
		const again = last?.hexes.length && last.player === g.turn;
		const passed = last?.hexes.length && last.player !== g.turn;
		const single = ss.legal[0]?.single;

		if (ss.robotTurn) {
			return [[again ? 'Robot closed a hex and goes again…' : 'Robot is thinking…']];
		}

		const out = [];

		if (passed) {
			out.push(robot ? ['Robot'] : who(last.player), [' closed one hex with a single line, so the turn passes. ']);
		}

		if (again) {
			out.push(robot ? ['You'] : who(g.turn), [' closed a hex. Go again']);
		} else {
			out.push(...(robot ? [['Your turn']] : [who(g.turn), ['’s turn']]));
		}

		out.push([` — ${ss.sel === null ? 'tap a dot' : single ? 'tap a neighboring dot' : 'tap a ringed dot'}.`]);

		if (single) {
			out.push([' No two-line moves left, so draw one line.']);
		}

		return out;
	});
</script>

<div class="status" aria-live="polite">
	{#each parts as [text, p], i (i)}
		{#if p}<b class="p{p}">{text}</b>{:else}{text}{/if}
	{/each}
</div>

<style>
	.status {
		min-height: 3em;
	}

	.p1 {
		color: var(--p1);
	}

	.p2 {
		color: var(--p2);
	}
</style>

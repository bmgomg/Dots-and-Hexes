<script>
	import { LEVEL_NAMES, LEVELS, ROBOT } from './const';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';

	const { player } = $props();
	const robot = $derived(player === 2 && ss.mode.opp === ROBOT);
	const level = $derived(LEVELS.indexOf(ss.mode.level) + 1);
	const spin = $derived(ss.game.turn === player && !ss.winner);
	const lost = $derived(ss.winner && ss.winner !== player);
	const nope = $derived(spin || ss.winner || ss.started);
</script>

<div class="avatar grid psc" class:nope onpointerdown={ss.switchFirst}>
	<div class="spinner" class:spin class:lost>
		<Hex size={56} color={player === 1 ? 'p1' : 'p2'} pips={robot ? level : 0} />
	</div>
	{#if robot}
		<div class="level">{LEVEL_NAMES[ss.mode.level]}</div>
	{/if}
	<!-- a pencil swoosh under whoever moves -->
	<svg class="swoosh" class:on={spin} viewBox="0 0 56 10" aria-hidden="true"><use href="#swoosh" /></svg>
</div>

<style>
	.avatar {
		position: relative;
		width: 70px;
		place-items: center;
		cursor: var(--pencil);
	}

	.spinner {
		transition: opacity 0.5s;
	}

	/* the hexagon rocks on its turn */
	.spin {
		animation: rock 0.6s alternate infinite ease-in-out;
	}

	.lost {
		opacity: 0.35;
	}

	.level {
		font-size: 13px;
		white-space: nowrap;
		color: var(--ink-soft);
	}

	.swoosh {
		position: absolute;
		top: 100%;
		width: 56px;
		height: 10px;
		filter: url(#pencil);
		opacity: 0;
		transition: opacity 0.3s;
	}

	.swoosh.on {
		opacity: 1;
	}

	@keyframes rock {
		from {
			transform: rotate(-18deg);
		}
		to {
			transform: rotate(18deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}
	}
</style>

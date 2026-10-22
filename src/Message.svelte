<script>
	import { fade } from 'svelte/transition';
	import { MSG_SINGLES, MSG_START_TIP } from './const';
	import { boardSize, ss } from './shared.svelte';

	// Centered in the band between the scoreboard and the top of the board. The board is
	// centered in this grid row, so that band runs half the row less half the board.
	const half = $derived(ss.board ? (boardSize() * ss.board.view[3]) / ss.board.view[2] / 2 : 0);

	const onTapStartTip = () => {
		ss.dismissStartTip();
		ss.noStartTip = true;
		ss.persistCommon();
	};
</script>

{#if ss.gameScreen && ss.message}
	{#key ss.message}
		<div
			class="message grid {ss.message === MSG_START_TIP ? 'start-tip' : 'pulse'}"
			style="height: calc(50% - {half}px);"
			onpointerdown={onTapStartTip}
			transition:fade
		>
			<!-- the switch to single lines changes the turn rule, so it is highlighted -->
			<span class:hl={ss.message === MSG_SINGLES}>{ss.message}</span>
		</div>
	{/key}
{/if}

<style>
	.message {
		grid-area: 3/1;
		place-self: start center;
		place-content: center;
		font-size: 28px;
	}

	.start-tip {
		font-size: 17px;
		color: var(--ink-soft);
		cursor: var(--pencil);
	}

	.pulse {
		animation: pulse 0.2s alternate 6 ease-in-out;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0.85);
		}
	}
</style>

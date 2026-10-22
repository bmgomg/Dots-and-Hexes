<script>
	import { fade } from 'svelte/transition';
	import { LEVEL_NAMES, LEVELS, ROBOT } from './const';
	import { SIZES } from './engine';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';
	import Button from './Button.svelte';

	let size = $derived(ss.mode.size);
	let level = $derived(ss.mode.level);

	const onPlay = () => {
		ss.launcher = false;
		ss.message = null;

		ss.mode.size = size;
		ss.mode.level = level;

		ss.persistCommon();

		if (ss.loadGame()) {
			ss.maybeShowStartTip();
			ss.maybeRobot();
		} else {
			ss.newGame();
		}
	};
</script>

{#if ss.launcher}
	<!-- an index card taped to the pad; the choices are circled in blue pencil -->
	<div class="launcher card" transition:fade={{ duration: 200 }}>
		<div class="prompt">Select size</div>
		<div class="ops">
			{#each SIZES as sz (sz)}
				<div class="size" class:selected={sz === size} onpointerdown={() => (size = sz)}>{sz}</div>
			{/each}
		</div>
		{#if ss.mode.opp === ROBOT}
			<div class="prompt second">Select opponent</div>
			<div class="ops skills">
				{#each LEVELS as lv, i (lv)}
					<div class="skill" class:selected={lv === level} onpointerdown={() => (level = lv)}>
						<Hex size={46} color="p2" pips={i + 1} />
						<span>{LEVEL_NAMES[lv]}</span>
					</div>
				{/each}
			</div>
		{/if}
		<div class="play">
			<Button big label="play" onClick={onPlay} />
			<svg class="underline" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
				<use href="#underline2" width="100" height="12" />
			</svg>
		</div>
	</div>
{/if}

<style>
	.launcher {
		place-self: center;
		grid-area: 3/1;
		display: grid;
		justify-items: center;
		gap: 14px;
		width: 370px;
		box-sizing: border-box;
		padding: 34px 22px 22px;
		transform: rotate(-1.2deg);
		z-index: 1;
	}

	.prompt {
		justify-self: start;
		font-size: 16px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.second {
		margin-top: 10px;
	}

	.ops {
		display: grid;
		grid-auto-flow: column;
		gap: 24px;
	}

	.skills {
		gap: 6px;
	}

	.size,
	.skill {
		position: relative;
		color: var(--ink);
		opacity: 0.5;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.size:hover,
	.skill:hover,
	.selected {
		opacity: 1;
	}

	.selected {
		pointer-events: none;
	}

	/* a loose loop in blue pencil around the choice */
	.selected::after {
		content: '';
		position: absolute;
		inset: -2px;
		border: 2.2px solid var(--p1);
		border-radius: 52% 46% 55% 44% / 48% 55% 45% 52%;
		transform: rotate(-6deg);
		filter: url(#pencil);
		pointer-events: none;
	}

	.size {
		width: 64px;
		height: 56px;
		display: grid;
		place-content: center;
		font-size: 32px;
	}

	.skill {
		width: 78px;
		height: 92px;
		box-sizing: border-box;
		padding-top: 8px;
		display: grid;
		justify-items: center;
		align-content: start;
		gap: 4px;
		font-size: 14px;
		white-space: nowrap;
	}

	.play {
		margin-top: 8px;
		display: grid;
		justify-items: center;
	}

	.underline {
		width: 100px;
		height: 12px;
		margin-top: -10px;
		overflow: visible;
		filter: url(#pencil);
		pointer-events: none;
	}
</style>

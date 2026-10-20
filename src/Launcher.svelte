<script>
	import Play from '$lib/images/Play.webp';
	import { fade } from 'svelte/transition';
	import { LEVELS, ROBOT } from './const';
	import { SIZES } from './engine';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';
	import ToolButton from './Tool Button.svelte';

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
	<div class="launcher" transition:fade={{ duration: 200 }}>
		<div class="prompt">Select size</div>
		<div class="ops">
			{#each SIZES as sz (sz)}
				<div class="size" class:size-selected={sz === size} onpointerdown={() => (size = sz)}>{sz}</div>
			{/each}
		</div>
		<span></span>
		{#if ss.mode.opp === ROBOT}
			<div class="prompt">Select opponent</div>
			<div class="ops">
				{#each LEVELS as lv, i (lv)}
					<div class="skill" class:skill-selected={lv === level} onpointerdown={() => (level = lv)}>
						<div class="skill-img-wrapper" class:skill-img-wrapper-selected={lv === level}>
							<div class="skill-img"><Hex size={46} fill="var(--p2)" pips={i + 1} /></div>
						</div>
						<span>{lv}</span>
					</div>
				{/each}
			</div>
			<span></span>
		{/if}
		<div class="play">
			<ToolButton img={Play} hue={-60} height={60} onClick={onPlay} />
		</div>
	</div>
{/if}

<style>
	.launcher {
		place-self: center;
		grid-area: 3/1;
		display: grid;
		gap: 20px;
		background: #00000060;
		box-sizing: border-box;
		padding: 30px;
		border-radius: 20px;
		z-index: 1;
	}

	.prompt {
		z-index: 1;
		font-size: 22px;
	}

	.ops {
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 15px;
		z-index: 1;
	}

	.size {
		place-self: center;
		font-size: 24px;
		height: 50px;
		aspect-ratio: 1;
		border-radius: 50%;
		display: grid;
		place-content: center;
		box-sizing: border-box;
		text-shadow: 2px 2px 2px black;
		color: var(--ink);
		border: 2px solid var(--ink);
		filter: drop-shadow(0 5px 5px black);
		opacity: 0.6;
		cursor: pointer;
		transition: all 0.2s;
	}

	.size:hover {
		opacity: 1;
	}

	.size-selected {
		opacity: 1;
		background: -webkit-linear-gradient(-90deg, #fff -150%, var(--bg) 100%);
		--hi: #fff;
		color: var(--hi);
		border: 2px solid var(--hi);
		filter: drop-shadow(0 5px 5px black) brightness(1.2);
		pointer-events: none;
	}

	.skill {
		display: grid;
		gap: 10px;
		place-items: center;
		box-sizing: border-box;
		text-shadow: 1px 1px 1px black;
		color: var(--ink);
		opacity: 0.6;
		cursor: pointer;
		transition: all 0.2s;
		letter-spacing: 0.1em;
	}

	.skill-selected {
		opacity: 1;
		--hi: #fff;
		color: var(--hi);
		pointer-events: none;
	}

	.skill:hover {
		opacity: 1;
	}

	.skill-img-wrapper {
		display: grid;
		height: 70px;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 2px solid var(--ink);
		filter: drop-shadow(0 5px 5px black);
	}

	.skill-img-wrapper-selected {
		border: 2px solid var(--hi);
		background: -webkit-linear-gradient(-90deg, #fff -150%, var(--bg) 100%);
		filter: drop-shadow(0 5px 5px black) brightness(1.2);
	}

	.skill-img {
		place-self: center;
	}

	.play {
		place-self: center;
	}
</style>

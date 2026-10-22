<script>
	import { fade } from 'svelte/transition';
	import { LEVEL_NAMES, LEVELS, ROBOT, SCREEN_IN, SCREEN_OUT } from './const';
	import { boardOf, SIZES } from './engine';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';
	import { _sound, tap } from './sound.svelte';
	import Button from './Button.svelte';
	import Title from './Title.svelte';

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

		// the first tap that may start audio
		if (!_sound.musicPlayed) {
			_sound.playMusic();
		}
	};

	// A pencil sketch of each board, all at one scale, so the sizes compare at a glance.
	const SCALE = 7;
	const PAD = 0.2;

	const sketch = (sz) => {
		const bd = boardOf(sz);
		const xs = bd.verts.map((v) => v.x);
		const ys = bd.verts.map((v) => v.y);
		const x0 = Math.min(...xs) - PAD;
		const y0 = Math.min(...ys) - PAD;
		const w = Math.max(...xs) + PAD - x0;
		const h = Math.max(...ys) + PAD - y0;
		const hexes = bd.hexes.map((hx) => hx.vs.map((i) => `${bd.verts[i].x},${bd.verts[i].y}`).join(' '));

		return { view: `${x0} ${y0} ${w} ${h}`, width: w * SCALE, height: h * SCALE, hexes };
	};

	const sketches = Object.fromEntries(SIZES.map((sz) => [sz, sketch(sz)]));

	const onSize = (sz) => {
		tap();
		size = sz;
	};

	const onLevel = (lv) => {
		tap();
		level = lv;
	};
</script>

{#if ss.launcher}
	<div class="launcher-page" in:fade={SCREEN_IN} out:fade={SCREEN_OUT}>
		<Title spacer />
		<!-- an index card taped to the pad; the choices are circled in blue pencil -->
		<div class="launcher card">
			<div class="prompt">Select size</div>
			<div class="ops">
				{#each SIZES as sz (sz)}
					{@const sk = sketches[sz]}
					<div class="size" class:selected={sz === size} onpointerdown={() => onSize(sz)}>
						<svg class="sketch" viewBox={sk.view} width={sk.width} height={sk.height} aria-hidden="true">
							{#each sk.hexes as points, i (i)}
								<polygon {points} />
							{/each}
						</svg>
						<span>{sz}</span>
					</div>
				{/each}
			</div>
			{#if ss.mode.opp === ROBOT}
				<div class="prompt second">Select opponent</div>
				<div class="ops skills">
					{#each LEVELS as lv, i (lv)}
						<div class="skill" class:selected={lv === level} onpointerdown={() => onLevel(lv)}>
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
	</div>
{/if}

<style>
	/* spans the empty stats and scoreboard rows too; the title's spacer is at the same height as on the home screen */
	.launcher-page {
		place-self: stretch center;
		padding-top: var(--title-top);
		grid-area: 1/1/4/2;
		display: grid;
		grid-template-rows: auto 1fr;
		justify-items: center;
		z-index: 1;
	}

	/* centered between the title and the toolbar, whatever its height (the friend card is short) */
	.launcher {
		align-self: center;
		display: grid;
		justify-items: center;
		gap: 14px;
		width: 370px;
		box-sizing: border-box;
		padding: 34px 22px 22px;
		transform: rotate(-1.2deg);
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
		align-items: end;
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
		cursor: var(--pencil);
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

	/* the sketches sit on one line, so the numbers under them line up */
	.size {
		width: 76px;
		box-sizing: border-box;
		padding: 10px 0 2px;
		display: grid;
		grid-template-rows: 60px auto;
		justify-items: center;
		align-items: end;
		font-size: 28px;
		line-height: 1.2;
	}

	.sketch {
		overflow: visible;
		filter: url(#pencil);
	}

	.sketch polygon {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.1;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
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

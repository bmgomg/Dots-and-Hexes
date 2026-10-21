<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Option from './Home Option.svelte';
	import { ss } from './shared.svelte';

	onMount(ss.loadCommon);

	const hi = '<span style="color: var(--gold);">';
</script>

{#if ss.home}
	<div class="home ga11 nohi" in:fade={{ duration: 200 }}>
		<div class="title">Dots <span class="amp">&amp;</span> Hexes</div>
		<div class="tagline">Draw two. <span class="gold">Close a hex. Go again.</span></div>
		{#snippet bullet(text)}
			<div class="bullet-item">
				<div class="bullet"></div>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="text">{@html text}</div>
			</div>
		{/snippet}
		<div class="bullets">
			{@render bullet(`Take turns ${hi}tapping two dots</span> two steps apart. Both lines between them get drawn.`)}
			{@render bullet(`After the opening move, the path must ${hi}touch an existing line</span>, at either end or in the middle.`)}
			{@render bullet(`Close a hex to claim it, then ${hi}move again</span>.`)}
			{@render bullet(
				`When no two-line move is left, draw ${hi}one line at a time</span>. Then you move again only if your line closes two hexes at once.`
			)}
			{@render bullet(`When every line is drawn, the ${hi}most hexes</span> win.`)}
		</div>
		<div class="ops">
			<Option opp="human" />
			<Option opp="robot" />
		</div>
	</div>
{/if}

<style>
	.home {
		display: grid;
		z-index: 1;
		place-content: center;
	}

	.title {
		justify-self: center;
		font-size: 52px;
		letter-spacing: 0.04em;
		color: var(--orange);
	}

	.amp {
		color: var(--ink);
	}

	.tagline {
		justify-self: center;
		margin-top: 12px;
		font-style: italic;
		font-size: 18px;
		letter-spacing: 0.06em;
		opacity: 0.85;
	}

	.gold {
		color: var(--gold);
	}

	.bullets {
		margin: 40px 0;
		width: 380px;
		display: grid;
		gap: 20px;
	}

	.bullet-item {
		display: grid;
		grid: auto / auto 1fr;
		gap: 1em;
	}

	.bullet {
		background: var(--gold);
		border-radius: 50%;
		height: 5px;
		aspect-ratio: 1;
		translate: 0 10px;
	}

	.text {
		font-size: 20.5px;
		line-height: 1.1em;
		letter-spacing: 0.04em;
	}

	.ops {
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 40px;
	}
</style>

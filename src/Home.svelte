<script>
	import { fade } from 'svelte/transition';
	import { SCREEN_IN, SCREEN_OUT } from './const';
	import { onMount } from 'svelte';
	import Option from './Home Option.svelte';
	import Title from './Title.svelte';
	import { ss } from './shared.svelte';

	onMount(ss.loadCommon);

	// key words get a highlighter stroke (.hl is global: it lands in {@html})
	const hi = '<span class="hl">';
</script>

{#if ss.home}
	<div class="home ga11 nohi" in:fade={SCREEN_IN} out:fade={SCREEN_OUT}>
		<Title spacer />
		<div class="tagline">Draw two. <span class="hl">Close a hex. Go again.</span></div>
		{#snippet bullet(text, i)}
			<div class="bullet-item">
				<svg class="bullet" class:odd={i % 2} viewBox="0 0 12 12" aria-hidden="true">
					<polygon points="10.3,3.5 10.3,8.5 6,11 1.7,8.5 1.7,3.5 6,1" />
				</svg>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="text">{@html text}</div>
			</div>
		{/snippet}
		<div class="bullets">
			{@render bullet(`Take turns ${hi}tapping two dots</span> two steps apart. Both lines between them get drawn.`, 0)}
			{@render bullet(`After the opening move, the path must ${hi}touch an existing line</span>, at either end or in the&nbsp;middle.`, 1)}
			{@render bullet(`Close a hex to claim it, then ${hi}move again</span>.`, 2)}
			{@render bullet(
				`When no two-line move is left, draw ${hi}one line at a time</span>. Then you move again only if your line closes two hexes at once.`,
				3
			)}
			{@render bullet(`When every line is drawn, the ${hi}most hexes</span>&nbsp;win.`, 4)}
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
		place-content: start center;
		padding-top: var(--title-top);
	}

	.tagline {
		justify-self: center;
		margin-top: 22px;
		font-size: 21px;
	}

	.bullets {
		margin: 34px 0 46px;
		width: 430px;
		display: grid;
		gap: 16px;
	}

	.bullet-item {
		display: grid;
		grid: auto / 13px 1fr;
		gap: 11px;
	}

	.bullet {
		width: 13px;
		height: 13px;
		margin-top: 8px;
		fill: var(--p1);
		opacity: 0.75;
	}

	.bullet.odd {
		fill: var(--p2);
		opacity: 0.85;
	}

	.text {
		font-size: 19px;
		line-height: 27px;
	}

	.ops {
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 34px;
	}
</style>

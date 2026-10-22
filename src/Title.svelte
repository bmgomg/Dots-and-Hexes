<script>
	// The spacer holds the title's place in the home and launcher layouts; the title itself is
	// drawn once over both (Screen Title.svelte), so it stays put between them.
	const { spacer = false } = $props();
</script>

<!-- The game's title with its pencil underline. -->
<div class="title-block" class:spacer aria-hidden={spacer}>
	<div class="title"><span class="p1">Dots</span> &amp; <span class="p2">Hexes</span></div>
	<svg class="underline" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
		<use href="#underline2" width="100" height="12" />
	</svg>
</div>

<style>
	.title-block {
		display: grid;
		justify-items: center;
	}

	.spacer {
		visibility: hidden;
	}

	.title {
		font-size: 54px;
		line-height: 1.1;
		letter-spacing: 0.02em;
		transform: rotate(-1.5deg);
	}

	.p1 {
		color: var(--p1);
	}

	.p2 {
		color: #c4650f;
	}

	.underline {
		width: 300px;
		height: 12px;
		margin-top: 2px;
		overflow: visible;
		filter: url(#pencil);
	}
</style>

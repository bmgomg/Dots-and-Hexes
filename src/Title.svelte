<!-- The game's title with its pencil underline, on the home screen and the launcher. -->
<div class="title-block">
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

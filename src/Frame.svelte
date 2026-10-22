<script>
	import { DX, DY } from './const';
</script>

<!-- the graph pad itself, with a little paper grain -->
<div class="frame ga11" style="width: {DX}px; height: {DY}px;">
	<svg class="grain" aria-hidden="true"><rect width="100%" height="100%" filter="url(#grain)" /></svg>
</div>

<style>
	.frame {
		display: grid;
		/* Pure backdrop. The inline scale makes this a stacking context, which would
		   otherwise paint it above any plain in-flow content of its siblings — so every
		   new element on the board would need a z-index of its own to clear it.
		   Negative z-index puts it behind them all, while #app-content's own stacking
		   context keeps it in front of that background. */
		z-index: -1;
		pointer-events: none;
		background-color: var(--bg);
		background-image:
			linear-gradient(90deg, var(--grid-major) 1px, transparent 1px),
			linear-gradient(180deg, var(--grid-major) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-minor) 1px, transparent 1px),
			linear-gradient(180deg, var(--grid-minor) 1px, transparent 1px);
		background-size:
			50px 50px,
			50px 50px,
			10px 10px,
			10px 10px;
		box-shadow: 0 2px 14px #3c463240;
	}

	.grain {
		width: 100%;
		height: 100%;
	}
</style>

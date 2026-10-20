<script>
	import { DX, DY } from './const';
</script>

<div class="frame ga11" style="width: {DX}px; height: {DY}px;"></div>

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
		background: inherit;
		background-image: radial-gradient(transparent, black 150%);
		background-position: center;
	}
</style>

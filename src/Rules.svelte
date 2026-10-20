<div class="rules">
	<h2>How to play</h2>
	<ul>
		<li>Tap a dot, then tap a dot two steps away. The two lines between them get drawn. Neither line may be drawn already.</li>
		<li>At least one of the two dots you tap must already have a line. The first move is free.</li>
		<li>Close a hex to claim it. Then you move again.</li>
		<li>
			When no two-line move is left, players draw one line at a time (tap two neighboring dots). Then you move again only if your line
			closes two hexes at once.
		</li>
		<li>When all lines are drawn, the player with more hexes wins.</li>
	</ul>
</div>

<style>
	.rules {
		font-size: 15px;
		opacity: 0.75;
		border-top: 1px solid var(--line);
		padding-top: 12px;
	}

	h2 {
		font-size: 13px;
		font-weight: normal;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0 0 6px;
	}

	ul {
		margin: 0;
		padding-left: 18px;
		display: grid;
		gap: 4px;
	}
</style>

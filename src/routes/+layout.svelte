<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global {
		body {
			margin: 0;
			padding: 0;
			height: 100dvh;
			width: 100%;
			font-family: RC, system-ui, sans-serif;

			/* Triangula's palette */
			--bg: #20003d;
			--ink: #d3d3d3;
			--gold: #f5db94;
			--line: #ffffff40;
			--orange: #ff7300;
			--fill1: #ff00ff80;
			--fill2: #00ffff70;
			--p1: #ff00ffc0;
			--p2: #00ffffc8;

			background: var(--bg);
			color: var(--ink);
		}

		.nohi {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			user-select: none;
		}

		.nope {
			pointer-events: none;
			cursor: initial;
		}

		.grid {
			display: grid;
		}

		.flowcol {
			grid-auto-flow: column;
		}

		.ga11 {
			grid-area: 1/1;
		}

		.psc {
			place-self: center;
		}

		@font-face {
			font-family: RC;
			src: url('$lib/fonts/Roboto Condensed.ttf');
		}
	}
</style>

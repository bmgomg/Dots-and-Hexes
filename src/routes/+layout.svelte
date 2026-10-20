<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global {
		html {
			background: #080010;
		}

		body {
			margin: 0;
			padding: 0;
			min-height: 100dvh;
			font-family: RC, system-ui, sans-serif;
			font-size: 16px;
			line-height: 1.4;

			/* Triangula's palette */
			--bg: #20003d;
			--ink: #d3d3d3;
			--line: #ffffff30;
			--orange: #ff7300;
			--fill1: #ff00ff44;
			--fill2: #00ffff4c;
			--p1: #ff00ffc0;
			--p2: #00ffffc8;

			background: radial-gradient(ellipse 80% 60% at 15% 15%, #3a0060 0%, #1a0035 50%, #080010 100%);
			color: var(--ink);
		}

		.nohi {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			user-select: none;
		}

		@font-face {
			font-family: RC;
			src: url('$lib/fonts/Roboto Condensed.ttf');
		}
	}
</style>

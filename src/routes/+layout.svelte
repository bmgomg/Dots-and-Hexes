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
			font-family: AD, 'Comic Sans MS', cursive;

			/* Paper and pencil: a graph pad, graphite lines, blue and orange colored pencil */
			--bg: #f1f5ea; /* graph-pad paper */
			--grid-major: #c3d6b3; /* every 50px */
			--grid-minor: #dde8d3; /* every 10px */
			--ink: #2f2f34; /* graphite: text, dots */
			--ink-soft: #55555b; /* labels */
			--line: #4a4a50; /* drawn lines */
			--last: #1a1a1e; /* the last move, pressed hard */
			--p1: #2a63c4; /* blue pencil */
			--p2: #e07a1f; /* orange pencil, for strokes and fills */
			--p2-text: #b85d0c; /* orange dark enough for text */
			--friend: #d6a400; /* yellow pencil, "play with friend" */
			--gold: rgba(255, 216, 58, 0.62); /* highlighter: key words, button hover */
			--card: #fdfdf8; /* index cards taped to the pad */
			--tape: rgba(225, 222, 205, 0.75);
			--desk: #4a3a2e; /* the walnut desk under the pad, and the browser's bars around it */

			background: var(--desk);
			color: var(--ink);
		}

		/* a highlighter stroke behind text */
		.hl {
			background: linear-gradient(180deg, transparent 34%, var(--gold) 34%, var(--gold) 82%, transparent 82%);
			box-decoration-break: clone;
			-webkit-box-decoration-break: clone;
		}

		/* a white index card, taped on */
		.card {
			position: relative;
			background: var(--card);
			box-shadow:
				0 1px 1px #00000014,
				0 10px 18px -8px #1e321460;
		}

		.card::before {
			content: '';
			position: absolute;
			top: -13px;
			left: calc(50% - 45px);
			width: 90px;
			height: 26px;
			background: var(--tape);
			transform: rotate(3deg);
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
			font-family: AD;
			src: url('$lib/fonts/Architects Daughter.woff2') format('woff2');
		}
	}
</style>

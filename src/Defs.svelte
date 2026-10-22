<!--
	Pencil filters, colored-pencil fills and doodles shared by the hexagon icons, the pie and
	the underlines. Their numbers are in pixels, so they suit SVGs drawn about 1:1; the board
	is in hex units and keeps its own scaled copies.
-->
<svg class="defs" aria-hidden="true">
	<defs>
		<filter id="pencil" x="-10%" y="-10%" width="120%" height="120%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
			<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="5" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<!-- The walnut desk: noise stretched along x into broad streaks, tinted brown, fine dark
		     grain over it, and the whole bent by slow waves so the grain curves like real wood. -->
		<filter id="wood" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
			<feTurbulence type="fractalNoise" baseFrequency="0.002 0.03" numOctaves="4" seed="3" result="broad" />
			<feColorMatrix
				in="broad"
				type="matrix"
				values="0.35 0 0 0 0.155  0.25 0 0 0 0.1125  0.17 0 0 0 0.0825  0 0 0 0 1"
				result="tone"
			/>
			<feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="8" result="fine" />
			<feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.065  0 0 0 0 0.04  -3 0 0 0 1.55" result="lines" />
			<feComposite in="lines" in2="tone" operator="over" result="flat" />
			<feTurbulence type="fractalNoise" baseFrequency="0.0025 0.006" numOctaves="2" seed="11" result="warp" />
			<feDisplacementMap in="flat" in2="warp" scale="45" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="grain">
			<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
			<feComponentTransfer><feFuncA type="table" tableValues="0 0.06" /></feComponentTransfer>
		</filter>

		<!-- a light wash under a zigzag scribble; the two players slant opposite ways -->
		{#each [['fill1', 24], ['fill2', -24], ['fill3', -24]] as [id, angle] (id)}
			<pattern {id} class={id} patternUnits="userSpaceOnUse" width="10" height="6" patternTransform="rotate({angle})">
				<rect class="wash" width="10" height="6" />
				<path class="scribble" d="M0 5 L2.5 1 L5 5 L7.5 1 L10 5" />
			</pattern>
		{/each}

		<symbol id="underline2" viewBox="0 0 100 12" preserveAspectRatio="none">
			<path class="u1" d="M3 4 Q50 1 97 3" />
			<path class="u2" d="M10 10 Q52 7 90 9" />
		</symbol>
		<symbol id="swoosh" viewBox="0 0 56 10">
			<path d="M4 6 Q20 2 30 5 T53 3" />
		</symbol>
	</defs>
</svg>

<style>
	.defs {
		position: absolute;
		width: 0;
		height: 0;
	}

	.fill1 {
		color: var(--p1);
	}

	.fill2 {
		color: var(--p2);
	}

	.fill3 {
		color: var(--friend);
	}

	.wash {
		fill: currentColor;
		fill-opacity: 0.22;
	}

	.scribble {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linejoin: round;
		opacity: 0.65;
	}

	.u1,
	.u2 {
		fill: none;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	.u1 {
		stroke: var(--p1);
		stroke-width: 2.2;
	}

	.u2 {
		stroke: var(--p2);
		stroke-width: 2;
	}

	symbol#swoosh path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
		stroke-linecap: round;
	}
</style>

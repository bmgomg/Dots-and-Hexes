<script>
	// A plain handwritten button for the toolbar, launcher and prompts. A toggle passes its
	// other label as `alt`: the button keeps room for both, so flipping it moves nothing.
	// A click presses it in and springs it back, and what it does follows once the press has shown (a prompt
	// would otherwise start fading before the press is seen); clicks during the press are ignored.
	import { tap } from './sound.svelte';
	import { post } from './utils';

	const { label, alt, big = false, disabled = false, onClick } = $props();

	// in ms: the press, and when the button acts, partway into the spring back
	const PRESS = 220;
	const ACT = 150;

	let pressed = $state(false);

	const onclick = () => {
		if (pressed) {
			return;
		}

		tap();
		pressed = true;
		post(() => onClick?.(), ACT);
		post(() => (pressed = false), PRESS);
	};
</script>

<button type="button" class="button" class:big class:pressed {disabled} {onclick} style:--press="{PRESS}ms">
	{#if alt}
		<span class="labels"><span>{label}</span><span class="ghost" aria-hidden="true">{alt}</span></span>
	{:else}
		{label}
	{/if}
</button>

<style>
	.button {
		font: inherit;
		font-size: 17px;
		color: var(--ink);
		background: transparent;
		border: 0;
		min-height: 44px;
		padding: 0 8px;
		cursor: var(--pencil);
		transition: scale 0.1s;
	}

	/* a thin highlighter line under the word */
	.button:hover {
		background: linear-gradient(180deg, transparent 62%, var(--gold) 62%, var(--gold) 80%, transparent 80%);
	}

	.button:active {
		scale: 0.92;
	}

	/* from where a held press leaves it, back up a touch past full size, and settle */
	.pressed {
		animation: press var(--press) ease-out;
	}

	.button:disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.labels {
		display: grid;
		justify-items: center;
	}

	.labels > * {
		grid-area: 1/1;
	}

	.ghost {
		visibility: hidden;
	}

	.big {
		font-size: 30px;
		min-height: 56px;
		padding: 0 18px;
	}

	@keyframes press {
		from {
			scale: 0.92;
		}

		60% {
			scale: 1.04;
		}

		to {
			scale: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pressed {
			animation: none;
		}
	}
</style>

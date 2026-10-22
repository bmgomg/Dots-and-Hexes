<script>
	// A plain handwritten button for the toolbar, launcher and prompts. A toggle passes its
	// other label as `alt`: the button keeps room for both, so flipping it moves nothing.
	import { tap } from './sound.svelte';

	const { label, alt, big = false, disabled = false, onClick } = $props();

	const onclick = () => {
		tap();
		onClick?.();
	};
</script>

<button type="button" class="button" class:big {disabled} {onclick}>
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
		cursor: pointer;
		transition: scale 0.1s;
	}

	/* a thin highlighter line under the word */
	.button:hover {
		background: linear-gradient(180deg, transparent 62%, var(--gold) 62%, var(--gold) 80%, transparent 80%);
	}

	.button:active {
		scale: 0.92;
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
</style>

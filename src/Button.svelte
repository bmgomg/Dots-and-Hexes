<script>
	// A plain handwritten button for the toolbar, launcher and prompts.
	const { label, big = false, disabled = false, onClick } = $props();
</script>

<button type="button" class="button" class:big {disabled} onclick={onClick}>{label}</button>

<style>
	.button {
		font: inherit;
		font-size: 17px;
		color: var(--ink);
		background: transparent;
		border: 0;
		min-height: 44px;
		padding: 0 11px;
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

	.big {
		font-size: 30px;
		min-height: 56px;
		padding: 0 18px;
	}
</style>

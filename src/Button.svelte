<script>
	// A plain text button for the toolbar, launcher and prompts.
	const { label, big = false, disabled = false, onClick } = $props();
</script>

<button type="button" class="button" class:big {disabled} onclick={onClick}>{label}</button>

<style>
	.button {
		font: inherit;
		font-size: 16px;
		letter-spacing: 0.04em;
		color: var(--ink);
		background: #ffffff10;
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 8px 14px;
		cursor: pointer;
		transition:
			scale 0.1s,
			background-color 0.2s;
	}

	.button:hover {
		background: #ffffff20;
	}

	.button:active {
		scale: 0.92;
	}

	.button:disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	.big {
		font-size: 22px;
		padding: 10px 28px;
		border-radius: 999px;
		background: var(--bg);
		border: 2px solid var(--ink);
		box-shadow: 0 4px 12px #000000a0;
	}

	.big:hover {
		background: #3a0060;
	}
</style>

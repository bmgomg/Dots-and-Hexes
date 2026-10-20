<script>
	// A row of mutually exclusive buttons for one ss.mode setting.
	import { ss } from './shared.svelte';

	const { label, key, options } = $props();
</script>

<div class="setting">
	<span class="label">{label}</span>
	<div class="seg">
		{#each options as [value, text] (value)}
			<button type="button" aria-pressed={ss.mode[key] === value} onclick={() => ss.setMode(key, value)}>{text}</button>
		{/each}
	</div>
</div>

<style>
	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}

	.label {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		opacity: 0.7;
	}

	.seg {
		display: inline-flex;
		border: 1px solid var(--line);
		border-radius: 10px;
		overflow: hidden;
	}

	button {
		font: inherit;
		color: inherit;
		background: none;
		border: 0;
		padding: 6px 12px;
		cursor: pointer;
	}

	button + button {
		border-left: 1px solid var(--line);
	}

	button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg);
	}
</style>

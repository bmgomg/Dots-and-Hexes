<script>
	import Board from '../Board.svelte';
	import Rules from '../Rules.svelte';
	import Scoreboard from '../Scoreboard.svelte';
	import Settings from '../Settings.svelte';
	import Status from '../Status.svelte';
	import { onMount } from 'svelte';
	import { ss } from '../shared.svelte';

	onMount(ss.load);
</script>

<main class="app">
	<header>
		<h1>Dots &amp; Hexes</h1>
		<div class="buttons">
			<button type="button" disabled={!ss.canUndo} onclick={ss.undo}>Undo</button>
			<button type="button" onclick={ss.newGame}>New game</button>
		</div>
	</header>

	{#if ss.game}
		<Scoreboard />
		<Board />
		<Status />
		<Settings />
	{/if}

	<Rules />
</main>

<style>
	.app {
		box-sizing: border-box;
		max-width: 480px;
		margin: 0 auto;
		padding: 14px max(16px, env(safe-area-inset-right)) 32px max(16px, env(safe-area-inset-left));
		display: grid;
		gap: 12px;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	h1 {
		margin: 0;
		font-size: 24px;
		font-weight: normal;
		letter-spacing: 0.04em;
		color: var(--orange);
	}

	.buttons {
		display: flex;
		gap: 8px;
	}

	button {
		font: inherit;
		color: inherit;
		background: #ffffff0d;
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 6px 14px;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>

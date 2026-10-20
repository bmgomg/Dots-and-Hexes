<script>
	import Board from './Board.svelte';
	import Launcher from './Launcher.svelte';
	import Message from './Message.svelte';
	import Prompt from './Prompt.svelte';
	import Scoreboard from './Scoreboard.svelte';
	import { ss } from './shared.svelte';
	import Stats from './Stats.svelte';
	import Toolbar from './Toolbar.svelte';
</script>

<div class="game-page ga11" class:show={!ss.home}>
	<Stats />
	<Scoreboard />
	{#if !ss.launcher && ss.game}
		<Board />
	{/if}
	<Launcher />
	<Message />
	<Prompt />
	<Toolbar />
</div>

<style>
	.game-page {
		display: grid;
		grid: 50px 70px 1fr auto / auto;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.show {
		opacity: 1;
	}
</style>

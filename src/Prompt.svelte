<script>
	import { fade } from 'svelte/transition';
	import { PROMPT_NO, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS, PROMPT_RESIGN, PROMPT_START } from './const';
	import Button from './Button.svelte';
	import { ss } from './shared.svelte';

	const over = $derived(!!ss.winner);
	const start = $derived(ss.robotStart);
	const on = $derived(over || start || ss.prompt);
	const delay = $derived(over && !ss.prompt ? (ss.game.turn === 2 ? 2000 : 1000) : 0);

	const dismiss = () => (ss.prompt = null);

	const onRobotStart = () => {
		dismiss();
		ss.doRobotMove();
	};
</script>

{#if !ss.launcher && ss.game && on}
	{#key ss.prompt}
		<div class="prompt grid" in:fade|global={{ delay }} out:fade>
			{#if ss.prompt === PROMPT_RESET_STATS}
				<Button big label={ss.prompt} onClick={ss.resetStats} />
				<Button big label={PROMPT_NO} onClick={dismiss} />
			{:else if start}
				<Button big label={PROMPT_START} onClick={onRobotStart} />
			{:else if over}
				<Button big label={PROMPT_PLAY_AGAIN} onClick={ss.newGame} />
			{:else if ss.prompt === PROMPT_RESIGN}
				<Button big label={ss.prompt} onClick={ss.resign} />
				<Button big label={PROMPT_NO} onClick={dismiss} />
			{/if}
		</div>
	{/key}
{/if}

<style>
	.prompt {
		grid-area: 3/1;
		place-self: center;
		gap: 20px;
	}
</style>

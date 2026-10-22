<script>
	import { PROMPT_RESET_STATS, PROMPT_RESIGN } from './const';
	import { ss } from './shared.svelte';
	import Button from './Button.svelte';

	const noBack = $derived(!ss.launcher && ss.robotTurn && !ss.robotStart);
	const noResign = $derived(ss.launcher || ss.robotTurn || !ss.started || !!ss.winner);
	const noResetStats = $derived(ss.launcher || ss.stats.plays === 0);

	const onBack = () => {
		ss.prompt = null;
		ss.sel = null;

		if (ss.launcher) {
			ss.launcher = false;
			ss.home = true;
		} else {
			ss.launcher = true;
		}
	};

	const setPrompt = (prompt) => {
		ss.prompt = prompt;
		ss.sel = null;
	};
</script>

<div class="toolbar">
	<div class="row">
		<Button label="back" onClick={onBack} disabled={noBack} />
		<Button label="resign" onClick={() => setPrompt(PROMPT_RESIGN)} disabled={noResign} />
		<Button label="reset stats" onClick={() => setPrompt(PROMPT_RESET_STATS)} disabled={noResetStats} />	</div>
</div>

<style>
	.toolbar {
		grid-area: 4/1;
		display: grid;
		margin: 0 0 15px;
	}

	.row {
		display: grid;
		grid-auto-flow: column;
		place-content: center;
		gap: 4px;
	}
</style>

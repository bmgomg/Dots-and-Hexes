<script>
	import Back from '$lib/images/Back.webp';
	import HintsOff from '$lib/images/Hints Off.webp';
	import HintsOn from '$lib/images/Hints On.webp';
	import ResetStats from '$lib/images/Reset Stats.webp';
	import Surrender from '$lib/images/Surrender.webp';
	import { PROMPT_RESET_STATS, PROMPT_RESIGN } from './const';
	import { ss } from './shared.svelte';
	import ToolButton from './Tool Button.svelte';

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

	const onHints = () => {
		ss.showHints = !ss.showHints;
		ss.persistCommon();
	};

	const onOff = (on) => (on ? 'on' : 'off');
</script>

<div class="toolbar">
	<div class="row">
		<ToolButton img={Back} onClick={onBack} hue={60} disabled={noBack} label={['back']} />
		<ToolButton img={Surrender} label={['resign', '']} onClick={() => setPrompt(PROMPT_RESIGN)} hue={150} disabled={noResign} />
		<ToolButton
			img={ResetStats}
			label={['reset', 'stats']}
			onClick={() => setPrompt(PROMPT_RESET_STATS)}
			hue={-170}
			disabled={noResetStats}
		/>
		<ToolButton img={ss.showHints ? HintsOn : HintsOff} label={['hints', onOff(ss.showHints)]} onClick={onHints} />
	</div>
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
		gap: 15px;
	}
</style>

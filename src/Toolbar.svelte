<script>
	import { PROMPT_RESET_STATS, PROMPT_RESIGN } from './const';
	import { ss } from './shared.svelte';
	import { _sound, plop, sfx } from './sound.svelte';
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
		plop();
	};

	const onSfx = () => {
		_sound.sfx = 1 - _sound.sfx;

		if (_sound.sfx) {
			sfx('won', 4);
		}

		ss.persistCommon();
	};

	const onMusic = () => {
		_sound.music = _sound.music ? 0 : 1;
		_sound.playMusic();
		ss.persistCommon();
	};

	const onOff = (on) => (on ? 'on' : 'off');
</script>

<div class="toolbar">
	<div class="row">
		<Button label="back" onClick={onBack} disabled={noBack} />
		<Button label="resign" onClick={() => setPrompt(PROMPT_RESIGN)} disabled={noResign} />
		<Button label="reset stats" onClick={() => setPrompt(PROMPT_RESET_STATS)} disabled={noResetStats} />
		<Button label="sfx {onOff(_sound.sfx)}" alt="sfx {onOff(!_sound.sfx)}" onClick={onSfx} />
		<Button label="music {onOff(_sound.music)}" alt="music {onOff(!_sound.music)}" onClick={onMusic} />
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
		gap: 2px;
	}
</style>

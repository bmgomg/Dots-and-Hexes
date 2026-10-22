<script>
	import Defs from '../Defs.svelte';
	import Frame from '../Frame.svelte';
	import GamePage from '../Game Page.svelte';
	import Home from '../Home.svelte';
	import Splash from '../Splash.svelte';
	import { DX, DY } from '../const';
	import { ss } from '../shared.svelte';
	import { _sound } from '../sound.svelte';
	import { post } from '../utils';

	$effect(() => {
		const disable = (e) => {
			e.preventDefault();
		};

		const onResize = () => {
			const r = document.querySelector('#app').getBoundingClientRect();
			ss.scale = Math.min(1, r.width / DX, r.height / DY);
		};

		// the music pauses while the window is in the background: on is 1, paused is -1
		const toggleMusic = () => {
			_sound.music = -_sound.music;
			_sound.playMusic();
		};

		const onBlur = () => {
			if (_sound.music > 0 && _sound.musicPlayed) {
				toggleMusic();
			}
		};

		const onFocus = () => {
			if (_sound.music < 0) {
				toggleMusic();
			}
		};

		onResize();

		window.addEventListener('contextmenu', disable);
		window.addEventListener('dblclick', disable);
		window.addEventListener('resize', onResize);
		window.addEventListener('blur', onBlur);
		window.addEventListener('focus', onFocus);

		return () => {
			window.removeEventListener('contextmenu', disable);
			window.removeEventListener('dblclick', disable);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('blur', onBlur);
			window.removeEventListener('focus', onFocus);
		};
	});

	let splash = $state(true);
	post(() => (splash = false), 2000);
</script>

<div id="app" class="nohi">
	<Defs />
	<svg class="desk" aria-hidden="true"><rect width="100%" height="100%" filter="url(#wood)" /></svg>
	{#if splash}
		<Splash />
	{:else}
		<div id="app-content" style="scale: {ss.scale};">
			<Frame />
			<GamePage />
			<Home />
		</div>
	{/if}
</div>

<style>
	#app {
		height: 100dvh;
		display: grid;
		place-content: center;
		box-sizing: border-box;
		/* the desk around the pad: walnut, until the wood grain paints over it */
		background: #4a3a2e;
	}

	.desk {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}

	#app-content {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		touch-action: none;
		/* Load-bearing: this stacking context is what keeps .frame's z-index: -1 from
		   dropping behind #app's background. */
		z-index: 1;
		background: var(--bg);
	}
</style>

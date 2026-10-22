<script>
	import Defs from '../Defs.svelte';
	import Frame from '../Frame.svelte';
	import GamePage from '../Game Page.svelte';
	import Home from '../Home.svelte';
	import Splash from '../Splash.svelte';
	import { DX, DY } from '../const';
	import { ss } from '../shared.svelte';
	import { post } from '../utils';

	$effect(() => {
		const disable = (e) => {
			e.preventDefault();
		};

		const onResize = () => {
			const r = document.querySelector('#app').getBoundingClientRect();
			ss.scale = Math.min(1, r.width / DX, r.height / DY);
		};

		onResize();

		window.addEventListener('contextmenu', disable);
		window.addEventListener('dblclick', disable);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('contextmenu', disable);
			window.removeEventListener('dblclick', disable);
			window.removeEventListener('resize', onResize);
		};
	});

	let splash = $state(true);
	post(() => (splash = false), 2000);
</script>

<div id="app" class="nohi">
	<Defs />
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
		/* the desk around the pad */
		background: #34363a;
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

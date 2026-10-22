<script>
	import { fade } from 'svelte/transition';
	import { SCREEN_IN, SCREEN_OUT } from './const';
	import { ss } from './shared.svelte';
	import Title from './Title.svelte';
</script>

<!-- One title over the home screen and the launcher, in the place their spacers keep, so it
     stays put while they fade between each other; it fades only on the way to or from a game. -->
{#if ss.home || ss.launcher}
	<div class="screen-title ga11" in:fade={SCREEN_IN} out:fade={SCREEN_OUT}>
		<Title />
	</div>
{/if}

<style>
	.screen-title {
		place-self: start center;
		margin-top: var(--title-top);
		z-index: 2;
		pointer-events: none;
	}
</style>

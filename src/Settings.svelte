<script>
	import { HUMAN, ROBOT } from './const';
	import Seg from './Seg.svelte';
	import { ss } from './shared.svelte';
</script>

<div class="settings">
	<Seg
		label="Board"
		key="size"
		options={[
			[7, '7'],
			[13, '13'],
			[19, '19']
		]}
	/>
	<Seg
		label="Opponent"
		key="opp"
		options={[
			[HUMAN, 'Friend'],
			[ROBOT, 'Robot']
		]}
	/>
	{#if ss.mode.opp === ROBOT}
		<Seg
			label="Level"
			key="level"
			options={[
				['easy', 'Easy'],
				['medium', 'Medium'],
				['hard', 'Hard']
			]}
		/>
	{/if}
</div>

<style>
	.settings {
		display: grid;
		gap: 10px;
	}
</style>

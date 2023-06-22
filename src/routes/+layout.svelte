<script>
	import { writable } from 'svelte/store';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
	
	
	let highlight = writable();
	console.log(highlight);
</script>

<div class="app">
	<Header />
	
	<main>
		<slot />
	</main>

	<Footer highlight={highlight}/>
	<button class="hint" class:highlight={highlight} on:click="{() => highlight = !highlight}">Frame</button>
</div>

<style>
	.highlight {
		border: 2px solid red;
	}
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		padding: 1rem 0;
		max-width: 80%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<script>
	import Newsletter from './Newsletter.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="page">
	<p class="page__content">
		Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
	</p>
	<aside class="page__aside">
		<div class="ad"><img src="https://placehold.co/200x101?text=Some%20Ads" alt="some ads" /></div>

		<Newsletter />

		<div class="ad"><img src="https://placehold.co/200x100?text=Some%20Ads" alt="some ads" /></div>
	</aside>
</section>

<style>
	.page {
		display: flex;
		justify-content: space-between;
		gap: 2em;
	}

	.page__content {
		flex-basis: fit-content;
	}

	.page__aside {
		border: 1px solid var(--clr-00);
		border-radius: 5px;
		padding: .5em;
		width: 240px;
	}

	.ad img {
		width: 100%;
		display: block;
	}
</style>

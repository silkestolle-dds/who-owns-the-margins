<script>
  import Newsletter from './Newsletter.svelte';
	import Search from './Search.svelte';
</script>

<div class="aside">
	<div class="aside__ad"><img src="https://placehold.co/200x101?text=Some%20Ads" alt="some ads" /></div>
	<div class="aside__search">
		<Search />
	</div>
	<div class="aside__ad"><img src="https://placehold.co/200x100?text=Some%20Ads" alt="some ads" /></div>
	<div class="aside__newsletter">
		<Newsletter />
	</div>
	<div class="aside__ad"><img src="https://placehold.co/200x100?text=Some%20Ads" alt="some ads" /></div>
	<div class="aside__ad"><img src="https://placehold.co/200x100?text=Some%20Ads" alt="some ads" /></div>
	
</div>

<style lang="scss">
	.aside {
		border: 1px solid var(--clr-01);
		padding: 1em;

		&__ad {
			margin-bottom: 2rem;
			&:last-child {
				margin-bottom: 0;
			}
			& img {
				width: 100%;
				display: block;
			}
		}

		&__search, 
		&__newsletter  {
			margin-bottom: 1rem;
		}
	}

	.aside__ad:has(+ .aside__search),
	.aside__ad:has(+ .aside__newsletter) {
		margin-bottom: 1rem;
	}

	
</style>

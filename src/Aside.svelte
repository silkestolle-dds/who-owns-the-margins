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
			margin-top: 2rem;
			&:first-child {
				margin-top: 0;
			}
			& img {
				width: 100%;
				display: block;
			}
		}

		&__search, 
		&__newsletter  {
			margin-top: 1rem;
		}

		.aside__search + .aside__ad,
		.aside__newsletter + .aside__ad {
			margin-top: 1rem;
		}
	}
	
</style>

<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header>
	<div class="logo">
		@ Logo
	</div>

	<div class="meta">
		<a href="">
			Search
		</a>
		<a href="">
			Wishlist
		</a>
		<a href="">
			Basket
		</a>		
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: var(--clr-02);
	}

	@media (min-width: 780px) {
		header {
			padding: 2rem 10%;
		}
	}
	
	.logo {
		font-size: 1.5rem;
	}
	
	.meta a {
		margin: .5rem;
	}

</style>

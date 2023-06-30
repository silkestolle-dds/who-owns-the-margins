<script>
import Search from "./Search.svelte";
</script>

<div class="header">
	<h1 class="header__logo">@ Logo</h1>
	<div class="header__meta meta">
		<nav class="meta__nav">
			<a href="#top">
				My Account
			</a>
			<a href="#top">
				Wishlist
			</a>
			<a href="#top">
				Basket
			</a>
		</nav>
		<div class="meta__search">
			<Search />
		</div>
	</div>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		background-color: var(--clr-02);
		padding: 2rem 10%;
	}

	.meta {
		&__nav {
			text-align: right;

			a {
				margin-left: 1rem;
			}
		}
		&__search {
			margin-top: 1rem;
		}
	}

</style>

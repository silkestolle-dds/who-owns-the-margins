<script>
	export let name;
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Aside from './Aside.svelte';
	import Teasers from './Teasers.svelte';
  import Newsletter from './Newsletter.svelte';
	
</script>

<div class="app">
<header>
	<Header />
</header>
<main class="main">
	<section class="main__content">
		<div class="content content__intro">
			<h1>Hello {name}!</h1>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
		</div>
		<div class="content__newsletter">
			<Newsletter />
		</div>
		<div class="content__teasers">
			<Teasers />
		</div>
	</section>
	<aside class="main__aside">
		<Aside />
	</aside>
</main>
<footer>
	<Footer />
</footer>
</div>


<style lang="scss">

.main {
    display: flex;
    justify-content: space-between;
    gap: 2em;
 
    &__content {
        flex-basis: fit-content;
    }
	  &__aside {
			padding: .5em;
			width: 240px;
    }
}


	.app {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
		}

	.main {
		display: flex;
		justify-content: space-between;
		gap: 2em;
		margin: 2rem 0;

		&__content {
			flex-basis: fit-content;
		}

		&__aside {
			padding: .5em;
			width: 240px;
		}
	}

	.content {
		&__intro {
			font-style: italic;
		}
		&__teasers {
			margin-top: 2rem;
		}
		&__newsletter {
			margin-top: 2rem;
		}
	}

	
	@media (min-width: 780px){
		.main {
			width: 80%;
			margin: 2rem auto;
		}
	}

</style>
<script>
	import Newsletter from "./Newsletter.svelte";
</script>

<footer class="footer">
		<ul class="footer__linklist">
			<li>&raquo; <a href="news">News</a></li>
			<li>&raquo; <a href="news">Contact</a></li>
			<li>&raquo; <a href="about">About</a></li>
		</ul>
		<ul class="footer__linklist">
			<li>&raquo; <a href="news">Jobs</a></li>
			<li>&raquo; <a href="news">Imprint</a></li>
			<li>&raquo; <a href="news">Compliance</a></li>
		</ul>
		<div class="footer__teaser">
			<Newsletter />
		</div>
	</footer>

<style lang="scss">
.footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 12px;
		background-color: var(--clr-02);
	}
	@media (min-width: 780px) {
		.footer {
			padding: 2rem 10%;
		}
	}

	.footer__linklist {
    list-style: none;
    margin: 0;
    padding: 0;
	}

  .footer__linklist li {
    margin-top: .5em;
	}


	
</style>

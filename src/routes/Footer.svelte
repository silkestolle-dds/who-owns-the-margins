<script>
import Newsletter from './Newsletter.svelte';
import { readable } from 'svelte/store';
let highlight = false;
console.log(highlight)
</script>

<footer>
		<ul class="linklist">
			<li>&raquo; <a href="news">News</a></li>
			<li>&raquo; <a href="news">Contact</a></li>
			<li>&raquo; <a href="news">Accessibility</a></li>
		</ul>
		<ul class="linklist">
			<li>&raquo; <a href="news">Jobs</a></li>
			<li>&raquo; <a href="news">Imprint</a></li>
			<li>&raquo; <a href="news">Compliance</a></li>
		</ul>
		<Newsletter highlight={highlight}/>
	</footer>

<style>
footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 12px;
		background-color: var(--clr-02);
	}

	.linklist {
    list-style: none;
    margin: 0;
    padding: 0;
	}

  .linklist li {
    margin-top: .5em;
	}

	@media (min-width: 780px) {
		footer {
			padding: 2rem 10%;
		}
	}
</style>

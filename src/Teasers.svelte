<script>
	
</script>

<div class="template">
	<div class="template__box1">
		<h2>Less is more</h2>
		<p>Presentation about our updated diconium frontend guidelines</p>
	</div>
	<div class="template__box2">
		<h2>Who owns the margins?!</h2>
		<p>Create re-usable components and their outerspacings based on context.</p>
	</div>
	<div class="template__box3">
		<h2>React Performance Part 2</h2>
		<p>Done by Stefan Winkler 🤘</p>
	</div>
</div>


<style lang="scss">
	.template {
		display: grid;
		grid-template-areas: "banner banner"
												 "teaser1 teaser2";
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		

		&__box1 {
			grid-area: banner;
			background-color: var(--clr-03);
			border-radius: 2px;
			padding: 1em;
		}

		&__box2 {
			grid-area: teaser1;
			border: 1px solid var(--clr-01);
			border-radius: 2px;
			padding: 1em;
		}

		&__box3 {
			grid-area: teaser2;
			border: 1px solid var(--clr-01);
			border-radius: 2px;
			padding: 1em;
		}
	}

</style>
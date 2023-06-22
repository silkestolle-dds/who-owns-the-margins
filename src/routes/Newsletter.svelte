<script>
  import { readable } from 'svelte/store';
	
	let highlight = readable();
	console.log(highlight);
</script>

<div class="newsletter" class:highlight={highlight}>
  <p><strong>Newsletter</strong></p>
  <form class="newsletter__form">
    <label for="email">Your e-mail adress:</label>
    <input type="text" id="email">
    <button>Subscribe</button>
  </form>
</div>

<style>
.newsletter {
  /* margin: 2rem 0; */
}

.newsletter__form {
  display: flex;
  flex-wrap: wrap;
}
label {
  width: 100%;
}
input {
  border: 1px solid var(--clr-01);
  border-radius: 5px;
  padding: .5em;
  flex-basis: fit-content;
}
button {
  border: 1px solid var(--clr-01);
  border-radius: 5px;
  padding: .5em;
}

.highlight {
  border: 1px solid var(--clr-03);
}
</style>

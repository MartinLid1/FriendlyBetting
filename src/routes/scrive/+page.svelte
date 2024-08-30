<script lang="ts">
	import { enhance } from '$app/forms';

	export let data: { documents: any[], error?: string };
	export let form: any;

	let documentId = '';
	let signatorie = '';
</script>

<main>
	<h1>Scrive Document Management</h1>

	{#if data.error}
		<p class="error">Error: {data.error}</p>
	{/if}

	<section>
		<h2>Create Document and start Signing Process</h2>
		<form method="POST" action="?/initiateSigning" use:enhance>
			<label>
				Document content:
				<input type="text" name="documentId" bind:value={documentId} required>
			</label>
			<label>
				Signatory email:
				<textarea name="signatories" bind:value={signatorie} required></textarea>
			</label>
			<button type="submit">Initiate Signing</button>
		</form>
	</section>

	{#if form}
		<section>
			<h2>Action Result</h2>
			{#if form.success}
				<pre>{JSON.stringify(form.result, null, 2)}</pre>
			{:else}
				<p class="error">Error: {form.error}</p>
			{/if}
		</section>
	{/if}
</main>

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    section {
        margin-bottom: 30px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    label {
        display: flex;
        flex-direction: column;
    }

    input, textarea {
        background-color: #000000;
        margin-top: 5px;
    }

    .error {
        color: red;
    }

    pre {
        background-color: #000000;
        padding: 10px;
        border-radius: 5px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
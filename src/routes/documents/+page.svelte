<script lang="ts">
	import { marked } from 'marked';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	async function refreshStatus(documentId: string) {
		try {
			const response = await fetch(`/documents/status/${documentId}`);
			if (response.ok) {
				const result = await response.json();
				console.log('Status updated:', result);
			} else {
				console.error('Failed to refresh status');
			}
		} catch (error) {
			console.error('Error refreshing status:', error);
		}
	}
</script>

<div class="container mx-auto">
	<h3 class="h3">Your bets</h3>
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each data.docs.items as doc}
			<div class="card variant-soft-{doc.scriveStatus ? 'primary' : 'error'} mt-5">
				<header class="card-header">
					<h5 class="h5">{doc.name}</h5>
				</header>
				<section class="p-4 text-small"><div>{@html marked(doc.content)}</div></section>
				<footer class="card-footer">
					{#each doc.expand.participants as p}
						<span class="chip mr-2 variant-filled">
							{p.name}
						</span>
					{/each}
					<button
						class="btn variant-filled-primary"
						on:click={() => refreshStatus(doc.scriveDocumentId)}
					>
						Refresh Status
					</button>
				</footer>
			</div>
		{/each}
	</div>
</div>

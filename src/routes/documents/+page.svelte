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
				window.location.reload();
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
			<div
				class="card variant-ghost-{doc.scriveStatus
					? 'success'
					: 'error'} mt-5 h-60 overflow-scroll"
			>
				<header class="card-header">
					<h5 class="h5">{doc.name}</h5>
					{#each doc.expand.participants as p}
						<span class="btn btn-xs variant-ghost mr-1">
							{p.name}
						</span>
					{/each}
				</header>
				<section class="p-4 text-small"><div>{@html marked(doc.content)}</div></section>
				<footer class="card-footer">
					<div>
						<button
							class="btn mt-5 variant-filled-secondary"
							on:click={() => refreshStatus(doc.scriveDocumentId)}
						>
							Refresh Status
						</button>
					</div>
				</footer>
			</div>
		{/each}
	</div>
</div>

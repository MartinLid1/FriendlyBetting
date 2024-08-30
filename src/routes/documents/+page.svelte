<script lang="ts">
	import { marked } from 'marked';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="container mx-auto">
	<h3 class="h3">Your bets</h3>
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each data.docs.items as doc}
			<div class="card variant-soft mt-5">
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
				</footer>
			</div>
		{/each}
	</div>
</div>

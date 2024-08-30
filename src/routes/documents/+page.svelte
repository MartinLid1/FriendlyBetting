<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="container mx-auto">
	{JSON.stringify(data)}
</div>

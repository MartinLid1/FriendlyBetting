<script lang="ts">
	let participants = [{ name: '', email: '' }];
	let contractDraft = '';
	let contractTitle;

	function addParticipant() {
		participants = [...participants, { name: '', email: '' }];
	}

	function removeParticipant(index: number) {
		if (participants.length > 1) {
			participants = participants.filter((_, i) => i !== index);
		}
	}
</script>

<div class="container mx-auto">
	<form method="post">
		<h3 class="h3">Participants</h3>
		<div class="flex flex-wrap gap-10">
			{#each participants as participant, index}
				<div class="w-2/5">
					<label class="label">
						Name:
						<input class="input" type="text" name="participants" bind:value={participant.name} />
					</label>
					<label>
						Email:
						<input class="input" type="email" name="participants" bind:value={participant.email} />
					</label>
					<button
						class="btn btn-xs variant-ghost-error mt-2"
						type="button"
						on:click={() => removeParticipant(index)}>Remove participant</button
					>
				</div>
			{/each}
		</div>

		<button class="btn variant-ghost-primary mt-2" type="button" on:click={addParticipant}
			>Add Participant</button
		>

		<h3 class="h3 mt-4">Contract draft</h3>
		<textarea class="textarea h-96 mt-2" bind:value={contractDraft} />

		<button class="btn variant-filled-success" type="submit">Create Contract</button>
	</form>
</div>

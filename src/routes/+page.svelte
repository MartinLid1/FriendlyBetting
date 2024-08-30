<script lang="ts">
	import { browser } from '$app/environment';

	let participants = [{ name: '', email: '' }];
	let contractDraft = '';
	let contractDraftResult = '';

	function addParticipant() {
		participants = [...participants, { name: '', email: '' }];
	}

	function removeParticipant(index: number) {
		if (participants.length > 1) {
			participants = participants.filter((_, i) => i !== index);
		}
	}

	async function createDraft() {
		if (!browser) return; // Ensure this runs only in the browser

		try {
			const response = await fetch('/createDraft/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ participants, contractDraft })
			});

			const result = await response.json();
			contractDraftResult = result;

			if (response.ok) {
				alert('Draft created successfully: ' + result.message);
			} else {
				alert('Failed to create draft: ' + result.message);
			}
		} catch (error) {
			console.error('Error creating draft:', error);
			alert('Error creating draft. Please try again.');
		}
	}
</script>

<div class="container mx-auto">
	<div>
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
		<h3 class="h3 mt-4">What do you want to create contract for?</h3>
		<input class="input mt-2" type="text" bind:value={contractDraft} />
		<button class="btn mt-2 variant-filled-success" type="button" on:click={createDraft}
			>Create Draft</button
		>

		<div>
			{JSON.stringify(contractDraftResult)}
		</div>
	</div>
</div>

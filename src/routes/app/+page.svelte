<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { marked } from 'marked';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let contractDraft = '';
	let contractDraftResult = '';
	let loading = false;
	let isEditing = false;
	export let data: PageData;
	let participants = [{ name: data.user?.name, email: data.user?.email }];

	function addParticipant() {
		participants = [...participants, { name: '', email: '' }];
	}

	function removeParticipant(index: number) {
		if (participants.length > 1) {
			participants = participants.filter((_, i) => i !== index);
		}
	}

	async function createContractTest() {
		if (!browser) return; // Ensure this runs only in the browser
		loading = true;

		try {
			const response = await fetch('/contracts/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					participants: [
						participants[0],
						{ name: 'Fredrik Öhrström', email: 'fredrik@ohrstrom.io' }
					],
					contractContent: 'contractDraftResult'
				})
			});

			if (response.ok) {
				goto('/documents');
			}
		} catch (error) {
			console.error('Error creating contract:', error);
			alert('Error creating contract. Please try again.');
		}

		loading = false;
	}

	async function createContract() {
		if (!browser) return; // Ensure this runs only in the browser
		loading = true;

		try {
			const response = await fetch('/contracts/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					participants,
					contractContent: contractDraftResult
				})
			});

			if (response.ok) {
				goto('/documents');
			}
		} catch (error) {
			console.error('Error creating contract:', error);
		}

		loading = false;
	}

	async function createDraft() {
		if (!browser) return; // Ensure this runs only in the browser
		loading = true;

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
			isEditing = false;
		} catch (error) {
			console.error('Error creating draft:', error);
			alert('Error creating draft. Please try again.');
		}

		loading = false;
	}

	function toggleEdit() {
		isEditing = !isEditing;
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
		<h3 class="h3 mt-4">What do you want to agree on?</h3>
		<input class="input mt-2" type="text" bind:value={contractDraft} />
		<button class="btn mt-2 variant-filled-primary" type="button" on:click={createDraft}
			>✨ Create Draft</button
		>

		{#if loading}
			Loading ...
		{/if}

		{#if contractDraftResult.length > 1}
			{#if isEditing}
				<textarea
					class="textarea mt-4"
					bind:value={contractDraftResult}
					style="height: {Math.max(200, contractDraftResult.split('\n').length * 20)}px;"
				></textarea>
				<button class="btn mt-2 variant-filled-primary" on:click={toggleEdit}>Save</button>
			{:else}
				<div class="mt-4">
					<div>{@html marked(contractDraftResult)}</div>
					<button class="btn mt-2 variant-filled-primary" on:click={toggleEdit}>Edit</button>
				</div>
			{/if}
		{/if}

		{#if contractDraftResult.length > 1 && !isEditing}
			<button class="btn mt-2 variant-filled-success" type="button" on:click={createContract}
				>Create Contract</button
			>
		{/if}
		<!--
		<button class="btn mt-2 variant-filled-success" type="button" on:click={createContractTest}
			>RASFQWAEFG</button
		>
		-->
	</div>
</div>

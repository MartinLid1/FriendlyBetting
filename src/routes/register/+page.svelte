<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	$: providers = { ...data.providers };

	const oauth = async () => {
		const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' });
		if (pb.authStore.isValid) {
			goto('human');
		}
	};
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="card p-5 max-w-sm text-center flex flex-col">
		<form
			class="flex flex-col"
			method="POST"
			action="?/register"
			use:enhance={() => {
				return async ({ result }) => {
					pb.authStore.loadFromCookie(document.cookie);
					await applyAction(result);
				};
			}}
		>
			<p class="mt-5">Welcome.</p>
			<p>Register using the form below or use a provider.</p>
			<div class="space-y-1 mt-5">
				<input type="email" name="email" placeholder="Email" class="input" />

				<input type="text" name="name" placeholder="Full name" class="input" />

				<input type="password" name="password" placeholder="Password" class="input mt-4" />
				<input
					type="password"
					name="passwordConfirm"
					placeholder="Confirm password"
					class="input"
				/>
			</div>
			<button class="mt-5 btn variant-ghost-primary">Register</button>
		</form>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import Agent0Header from '$lib/components/Agent0Header.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, errors, constraints, enhance, message } = superForm(data.form);

	let redirectMessage: string;
	$: redirectMessage = $page.url.searchParams.get('message') ?? '';
</script>

<svelte:head>
	<title>agent0.ai - Login</title>
	<meta name="description" content="agent0.ai - Login here" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
	<form method="POST" class="card variant-soft p-5 max-w-sm text-center flex flex-col" use:enhance>
		<Agent0Header level="h3" />
		{#if redirectMessage}
			<p class="card p-2 mt-2 mb-2 variant-soft-warning">{redirectMessage}</p>
		{/if}

		{#if $message}
			<p class:variant-soft-error={$page.status >= 400} class="card p-2 mt-2 mb-2">{$message}</p>
		{/if}

		<p>Enter credentials to continue.</p>
		<div class="space-y-1 mt-5">
			<input
				type="email"
				name="email"
				placeholder="Email"
				class="input variant-soft"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				{...$constraints.email}
			/>

			<input
				type="password"
				name="password"
				placeholder="Password"
				class="input variant-soft"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
				{...$constraints.password}
			/>
		</div>
		<button class="mt-5 btn variant-ghost-primary">Login</button>

		<div class="flex flex-row justify-around">
			<small class="mt-5"
				><a href="login/password-reset" class="hover:underline">Forgot password?</a></small
			>
			<small class="mt-5"
				><a href="/register" class="hover:underline">I want to register..</a></small
			>
		</div>
	</form>
</div>

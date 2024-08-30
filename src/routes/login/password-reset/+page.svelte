<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<div class="min-h-screen flex items-center justify-center">
	<form
		method="POST"
		class="card variant-soft p-5 max-w-sm text-center flex flex-col"
		use:enhance={() => {
			return async ({ result }) => {
				pb.authStore.loadFromCookie(document.cookie);
				await applyAction(result);
			};
		}}
	>
		<h3>Password reset</h3>
		If you are registered, you will recieve an email with password reset instructions.
		<div class="space-y-1 mt-5">
			<input type="email" name="email" placeholder="Registered email" class="input variant-soft" />
		</div>
		<button class="mt-5 btn variant-ghost-warning">Send reset email</button>
		<div class="flex flex-row justify-around">
			<small class="mt-5"><a href="/login" class="hover:underline">I think I remember..</a></small>
			<small class="mt-5"
				><a href="/register" class="hover:underline">I want to register..</a></small
			>
		</div>
	</form>
</div>

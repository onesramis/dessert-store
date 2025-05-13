<script lang="ts">
  import type { PageData } from "./$types";

  import { m } from "$lib/paraglide/messages";

  import ResetPasswordForm from "../components/reset-password-form.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{m["forms.reset-password.tab-title"]()} | Dessert Store</title>
</svelte:head>

<ResetPasswordForm {data} />

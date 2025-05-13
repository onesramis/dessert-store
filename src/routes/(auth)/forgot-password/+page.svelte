<script lang="ts">
  import type { PageData } from "./$types";

  import { m } from "$lib/paraglide/messages";

  import ForgotPasswordForm from "../components/forgot-password-form.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{m["forms.forgot-password.tab-title"]()} | Dessert Store</title>
</svelte:head>

<ForgotPasswordForm {data} />

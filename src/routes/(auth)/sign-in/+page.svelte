<script lang="ts">
  import type { PageData } from "./$types";

  import { m } from "$lib/paraglide/messages";

  import LoginForm from "../components/login-form.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{m["forms.sign-in.tab-title"]()} | Dessert Store</title>
</svelte:head>

<LoginForm {data} />

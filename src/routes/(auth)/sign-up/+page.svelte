<script lang="ts">
  import type { PageData } from "./$types";

  import { m } from "$lib/paraglide/messages"; 

  import RegisterForm from "../components/register-form.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{m["forms.sign-up.tab-title"]()} | Dessert Store</title>
</svelte:head>

<RegisterForm {data} />

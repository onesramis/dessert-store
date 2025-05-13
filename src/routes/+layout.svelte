<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  import "@fontsource-variable/red-hat-text";
  import "../globals.css";

  import { Toaster } from "$lib/components/ui/sonner";

  let { data, children } = $props();
</script>

<ModeWatcher defaultTheme="system" />
<Toaster richColors />

<QueryClientProvider client={data.queryClient}>
  {@render children()}
  <SvelteQueryDevtools />
</QueryClientProvider>

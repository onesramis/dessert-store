<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { WithElementRef } from "bits-ui";

  import { cn } from "$lib/utils";

  type Props = WithElementRef<Omit<HTMLInputAttributes, "type"> & { type?: "text" | "email" }>;

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    class: className,
    ...restProps
  }: Props = $props();
</script>

<input
  bind:this={ref}
  class={cn(
    "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  {type}
  bind:value
  {...restProps}
/>

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { WithElementRef } from "bits-ui";
  import { EyeIcon, EyeOffIcon } from "@lucide/svelte";

  import { cn } from "$lib/utils";

  type Props = WithElementRef<Omit<HTMLInputAttributes, "type">>;

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();

  let type = $state<"text" | "password">("password");
</script>

<div class="relative">
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

  <button
    type="button"
    class="absolute right-3 top-1/2 flex translate-y-[-50%] items-center justify-center text-rose-400 [&_svg]:size-4"
    onclick={() => (type = type === "password" ? "text" : "password")}
  >
    {#if type === "password"}
      <EyeOffIcon />
    {:else}
      <EyeIcon />
    {/if}
  </button>
</div>

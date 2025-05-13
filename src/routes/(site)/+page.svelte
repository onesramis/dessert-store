<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  import { api } from "$lib/api";

  import ProductCard from "$lib/components/ProductCard.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  const query = createQuery({
    queryKey: ["products"],
    queryFn: () => api().getProducts(),
  });
</script>

<svelte:head>
  <title>Products | Dessert Store</title>
  <meta
    name="description"
    content="Dessert products for your taste, like waffle, macaron, tiramisu, etc.,"
  />
</svelte:head>

<ScrollArea class="scrollable-products-list" scrollbarYClasses="hidden">
  <section class="products-list">
    {#if $query.status === "pending"}
      <p>Loading...</p>
    {:else if $query.status === "error"}
      <p>Error: {$query.error.message}</p>
    {:else}
      {#each $query.data as product}
        <ProductCard {product} />
      {/each}
    {/if}
  </section>
  <div class="xl:h-10"></div>
</ScrollArea>

<style lang="postcss">
  .products-list {
    --columns: 1;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 1.5rem;
  }

  @media screen and (min-width: 540px) {
    .products-list {
      --columns: 2;
      row-gap: 2rem;
    }
  }

  @media screen and (min-width: 768px) {
    .products-list {
      --columns: 3;
    }
  }

  @media screen and (min-width: 1280px) {
    :global(.scrollable-products-list) {
      height: calc(100vh - 102px);
      border-radius: 8px 8px 0 0;
    }
  }
</style>

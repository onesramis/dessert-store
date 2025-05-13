<script lang="ts">
  import {
    createMutation,
    createQuery,
    useIsMutating,
    useQueryClient,
  } from "@tanstack/svelte-query";
  import { Loader2Icon } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import currency from "currency.js";

  import { api } from "$lib/api";
  import type { Cart } from "$lib/types";
  import emptyCartSvg from "$lib/assets/illustration-empty-cart.svg";
  import removeItemSvg from "$lib/assets/remove-item.svg";
  import carbonNeutralSvg from "$lib/assets/carbon-neutral.svg";
  import { m } from "$lib/paraglide/messages";

  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  const queryClient = useQueryClient();

  const query = createQuery({
    queryKey: ["cart"],
    queryFn: () => api().getCart(),
  });

  const numOfItems = $derived(
    $query.data?.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0) || 0,
  );

  const isMutating = useIsMutating({ mutationKey: ["cart"] });
  const isCheckoutMutating = useIsMutating({ mutationKey: ["cart", "checkout"] });

  const itemClearMutation = createMutation({
    mutationKey: ["cart", "item-clear"],
    mutationFn: (productId: string) => api().clearItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(["cart"], (old) => {
          if (!old) return previousCart;
          const newItems = old.items.filter((item) => item.productId !== productId);
          return { ...old, items: newItems };
        });
      }

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<Cart>(["cart"], context.previousCart);
      }
    },
  });

  const onClearItem = async (productId: string) => {
    if ($isMutating > 0) return;
    $itemClearMutation.mutate(productId);
  };

  const checkoutMutation = createMutation({
    mutationKey: ["cart", "checkout"],
    mutationFn: () => api().checkout(),
    onError: () => {
      toast.error("Unable to checkout the cart");
    },
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
</script>

<div class="user-cart-wrapper">
  <h1 class="text-2xl font-bold text-orange">{m["cart.title"]()} ({numOfItems})</h1>

  {#if $query.status === "pending"}
    <p>Loading...</p>
  {:else if $query.status === "error"}
    <p>{$query.error.message}</p>
  {:else if $query.data.items.length > 0}
    {@const cart = $query.data}
    {@const total = cart.items.reduce((acc, item) => {
      const subtotal = currency(item.price).multiply(item.quantity);
      return acc.add(subtotal);
    }, currency(0))}

    <ScrollArea
      class={["h-[250px] pr-3", cart.items.length < 4 && "h-auto"]}
      scrollbarYClasses="w-1.5 bg-rose-100"
    >
      <div class="space-y-4">
        {#each cart.items as item, idx}
          <div class="cart-item">
            <div class="space-y-1 text-sm">
              <p class="font-semibold">{item.name}</p>
              <p>
                <span class="font-semibold text-orange">{item.quantity}x</span>
                <span class="ml-3 mr-2 text-rose">@ {currency(item.price).format()}</span>
                <span class="font-semibold text-rose">
                  {currency(item.price).multiply(item.quantity).format()}
                </span>
              </p>
            </div>

            <button
              type="button"
              class="clear-item-btn"
              onclick={() => onClearItem(item.productId)}
            >
              <img src={removeItemSvg} alt="Clear Item" />
            </button>
          </div>

          {#if idx !== cart.items.length - 1}
            <hr class="border-t border-rose-100" />
          {/if}
        {/each}
      </div>
    </ScrollArea>

    <hr class="border-t border-rose-100" />
    <div class="flex items-center justify-between">
      <p class="text-sm">{m["cart.order-total-title"]()}</p>
      <p class="text-2xl font-bold">{total.format()}</p>
    </div>
    <div class="flex items-center justify-center rounded-lg bg-rose-50 py-4 text-center">
      <img src={carbonNeutralSvg} alt="Carbon Neutral" />
      <p class="ml-2 text-sm">
        This is a <span class="font-semibold">carbon-neutral</span> delivery
      </p>
    </div>

    <Button
      type="submit"
      variant="primary"
      size="xl"
      class="w-full rounded-full"
      disabled={$isMutating > 0 || $isCheckoutMutating > 0}
      onclick={() => $checkoutMutation.mutate()}
    >
      {#if $isCheckoutMutating > 0}
        <Loader2Icon class="animate-spin" />
        {m["cart.checkout-btn-loading"]()}
      {:else}
        {m["cart.checkout-btn-label"]()}
      {/if}
    </Button>
  {:else}
    <div class="flex flex-col items-center gap-4 py-4">
      <img src={emptyCartSvg} alt="Empty Cart" />
      <p class="text-sm font-semibold text-rose">{m["cart.empty-text"]()}</p>
    </div>
  {/if}
</div>

<style>
  .user-cart-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-inline: 1.5rem;
    padding-block: 1.5rem;
    background-color: hsl(var(--color-white));
    border-radius: 12px;
  }

  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .clear-item-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid hsl(var(--color-rose-400));
    border-radius: 50%;
  }

  @media screen and (min-width: 1280px) {
    .user-cart-wrapper {
      position: sticky;
      top: 104px;
    }
  }
</style>

<script lang="ts">
  import { pushState } from "$app/navigation";
  import {
    createMutation,
    createQuery,
    useIsMutating,
    useQueryClient,
  } from "@tanstack/svelte-query";
  import { Image } from "@unpic/svelte";
  import { MinusCircleIcon, PlusCircleIcon } from "@lucide/svelte";

  import type { Cart, CartItem, Product } from "$lib/types";
  import { authClient } from "$lib/auth-client";
  import { api } from "$lib/api";
  import { m } from "$lib/paraglide/messages";

  import addToCartSvg from "$lib/assets/add-to-cart.svg";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader } from "$lib/components/ui/card";

  type Props = {
    product: Product;
  };

  let { product }: Props = $props();
  const session = authClient.useSession();

  const queryClient = useQueryClient();

  const query = createQuery({
    queryKey: ["cart"],
    queryFn: () => api().getCart(),
  });

  const isCheckoutMutating = useIsMutating({ mutationKey: ["cart", "checkout"] });
  const foundCartItem = $derived($query.data?.items.find((item) => item.productId === product.id));

  const increaseMutation = createMutation({
    mutationKey: ["cart", "increase"],
    mutationFn: (newItem: Omit<CartItem, "quantity">) => api().increaseItem(newItem),
    onMutate: async (newItem) => {
      if (!$session.data) return pushState("/sign-in", { loginModal: true });

      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(["cart"], (old) => {
          if (!old) return previousCart;
          const newItems = [...old.items];

          const foundItem = newItems.find((item) => item.productId === newItem.productId);
          if (foundItem) {
            const idx = newItems.findIndex((item) => item.productId === newItem.productId);
            if (idx != -1) {
              newItems.splice(idx, 1, { ...foundItem, quantity: foundItem.quantity + 1 });
            }
          } else {
            newItems.push({ ...newItem, quantity: 1 });
          }

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

  const decreaseMutation = createMutation({
    mutationKey: ["cart", "decrease"],
    mutationFn: async (itemId: string) => api().decreaseItem(itemId),
    onMutate: async () => {
      if (!$session.data) return pushState("/sign-in", { loginModal: true });

      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(["cart"], (old) => {
          if (!old) return previousCart;

          const newItems = [...old.items];
          const foundItem = newItems.find((item) => item.productId === product.id);
          const idx = newItems.findIndex((item) => item.productId === product.id);

          if (foundItem) {
            if (foundItem.quantity > 1) {
              newItems.splice(idx, 1, { ...foundItem, quantity: foundItem.quantity - 1 });
            } else {
              if (idx !== -1) {
                newItems.splice(idx, 1);
              }
            }
          }

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

  const onIncreaseItem = () => {
    $increaseMutation.mutate({
      productId: product.id,
      name: product.name,
      price: product.price,
      stripePriceId: product.stripePriceId,
    });
  };

  const onDecreaseItem = () => {
    $decreaseMutation.mutate(product.id);
  };
</script>

<Card class="space-y-9 border-none bg-transparent shadow-none">
  <CardHeader class="relative h-[212px] p-0">
    <Image
      src={product.image}
      layout="fullWidth"
      alt={product.name}
      class={[
        "h-full rounded-lg border-2 border-transparent object-cover",
        foundCartItem && "!border-primary",
      ]}
    />

    {#if foundCartItem}
      <div
        class="absolute bottom-[-22px] left-1/2 z-10 flex h-11 w-[160px] translate-x-[-50%] items-center justify-between rounded-full bg-orange px-3 text-white"
      >
        <button
          type="button"
          class="flex items-center justify-center [&_svg]:size-5"
          disabled={$isCheckoutMutating > 0}
          onclick={onDecreaseItem}
        >
          <MinusCircleIcon />
        </button>
        <p class="text-sm font-semibold">{foundCartItem.quantity}</p>

        <button
          type="button"
          class="flex items-center justify-center [&_svg]:size-5"
          disabled={$isCheckoutMutating > 0}
          onclick={onIncreaseItem}
        >
          <PlusCircleIcon />
        </button>
      </div>
    {:else}
      <Button
        type="submit"
        variant="outline"
        size="xl"
        disabled={$increaseMutation.isPending || $isCheckoutMutating > 0}
        class="absolute bottom-[-22px] left-1/2 z-10 w-[160px] translate-x-[-50%] rounded-full bg-white px-0 font-semibold disabled:opacity-100"
        onclick={onIncreaseItem}
      >
        <img src={addToCartSvg} alt="" />
        {m["buttons.add-to-cart"]()}
      </Button>
    {/if}
  </CardHeader>
  <CardContent class="space-y-0.5 p-0">
    <p class="text-sm text-rose">{product.category?.name}</p>
    <p class="font-semibold">{product.name}</p>
    <p class="font-semibold text-orange">${product.price}</p>
  </CardContent>
</Card>

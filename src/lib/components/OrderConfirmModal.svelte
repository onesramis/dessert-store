<script lang="ts">
  import { page } from "$app/state";
  import type Stripe from "stripe";
  import { createQuery } from "@tanstack/svelte-query";
  import { CheckCircle2Icon, LoaderIcon, TriangleAlertIcon } from "@lucide/svelte";
  import currency from "currency.js";

  import { api } from "$lib/api";
  import { authClient } from "$lib/auth-client";

  import { buttonVariants } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import { Dialog, DialogClose, DialogContent } from "$lib/components/ui/dialog";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  const success = Boolean(page.url.searchParams.get("success"));
  const stripeOrderId = page.url.searchParams.get("session_id");
  const session = authClient.useSession();

  const query = createQuery({
    queryKey: ["placed-order"],
    queryFn: () => api().getPlacedOrder(stripeOrderId as string),
    enabled: false,
  });

  let open = $derived(success && !!stripeOrderId && Boolean($session.data));
  const onOpenChange = (value: boolean) => {
    open = value;
  };

  $effect(() => {
    if (open) {
      $query.refetch();
    }

    history.replaceState(null, "", "/");
  });
</script>

<Dialog {open} {onOpenChange}>
  <DialogContent
    interactOutsideBehavior="ignore"
    class="top-20 h-[calc(100vh-80px)] rounded-t-xl bg-white sm:px-10 sm:py-10"
  >
    <div class="flex h-full flex-col">
      {#if $query.status === "pending"}
        <div class="flex items-center justify-center py-6">
          <LoaderIcon class="size-5 animate-spin text-rose" />
        </div>
      {:else if $query.status === "error"}
        <div class="flex items-center justify-center py-6">
          <TriangleAlertIcon class="size-6 text-[#da0909]" />
        </div>
      {:else if $query.status === "success"}
        <div class="flex h-full flex-col space-y-8">
          <div class="space-y-4">
            <CheckCircle2Icon class="size-10 text-green" />
            <div class="space-y-2">
              <h1 class="text-[2rem] font-bold">Order Confirmed</h1>
              <p class="text-rose">We hope you enjoy your food!</p>
            </div>
          </div>

          <div class="flex flex-col space-y-6 rounded-lg bg-rose-50 px-6 py-6">
            <ScrollArea
              class={["pr-3", $query.data.items.data.length > 2 && "h-[180px]"]}
              scrollbarYClasses="w-1.5"
            >
              <div class="space-y-4">
                {#each $query.data.items.data as item, idx}
                  {@const price = item.price as Stripe.Price}
                  {@const product = item.price?.product as Stripe.Product}

                  <div class="flex items-center">
                    <img src={product.images[0]} alt={product.name} class="size-12 rounded-sm" />
                    <div class="ml-4 mr-auto flex flex-col gap-1">
                      <p class="text-sm font-semibold">{product.name}</p>
                      <p class="flex items-center gap-3 text-sm">
                        <span class="font-semibold text-orange">{item.quantity}x</span>
                        <span class="text-rose">
                          @ {currency((price.unit_amount || 0) / 100).format()}
                        </span>
                      </p>
                    </div>
                    <p class="text-base font-semibold">
                      {currency(item.amount_total / 100).format()}
                    </p>
                  </div>

                  {#if idx !== $query.data.items.data.length - 1}
                    <Separator class="bg-rose-100" />
                  {/if}
                {/each}
              </div>
            </ScrollArea>

            <Separator class="bg-rose-100" />
            <div class="flex items-center justify-between">
              <p class="text-sm">Order Total</p>
              <p class="text-2xl font-bold">{currency($query.data.total).format()}</p>
            </div>
          </div>

          <DialogClose
            class={[
              buttonVariants({ variant: "primary", size: "xl" }),
              "w-full flex-shrink-0 !rounded-full",
            ]}
          >
            Start New Order
          </DialogClose>
        </div>
      {/if}
    </div>
  </DialogContent>
</Dialog>

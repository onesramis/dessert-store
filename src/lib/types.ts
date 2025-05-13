import type Stripe from "stripe";

import type { CategorySelect, ProductSelect } from "$lib/server/db/schema";

export type Product = Omit<
  ProductSelect,
  "categoryId" | "thumbnail" | "createdAt" | "updatedAt" | "stripeProductId"
> & {
  category: Pick<CategorySelect, "name"> | null;
};

export type CartItem = {
  name: string;
  price: string;
  quantity: number;
  productId: string;
  stripePriceId: string;
};

export type Cart = {
  id?: string;
  items: Array<CartItem>;
};

export type PlacedOrder = {
  id: string;
  total: string;
  items: Stripe.ApiList<Stripe.LineItem>;
};

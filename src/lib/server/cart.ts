import { and, eq } from "drizzle-orm";

import { db } from "$lib/server/db/drizzle";
import type { CartItem } from "$lib/types";
import { cartItems } from "$lib/server/db/schema";

export const getCart = async (userId: string) => {
  const cartItems: Array<CartItem> = [];

  const cart = await db.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.userId, userId),
    columns: {
      id: true,
    },
    with: {
      cartItems: {
        columns: {
          id: false,
          cartId: false,
        },
        with: {
          product: {
            columns: {
              image: false,
              thumbnail: false,
              categoryId: false,
              stripeProductId: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
      },
    },
  });

  for (const item of cart?.cartItems || []) {
    cartItems.push({
      id: item.productId,
      name: item.product?.name,
      price: item.product?.price,
      quantity: item.quantity,
      productId: item.productId,
      stripePriceId: item.product?.stripePriceId,
    } as CartItem);
  }

  return {
    id: cart?.id,
    items: cartItems,
  };
};

export const increaseItem = async (
  item: { productId: string; price: string; stripePriceId: string },
  cartId: string,
) => {
  const cartItem = await db.query.cartItems.findFirst({
    where: (cartItems, { and, eq }) =>
      and(eq(cartItems.productId, item.productId), eq(cartItems.cartId, cartId)),
  });

  if (cartItem) {
    await db
      .update(cartItems)
      .set({ quantity: cartItem.quantity + 1 })
      .where(eq(cartItems.id, cartItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId,
      productId: item.productId,
      price: item.price,
      quantity: 1,
      stripePriceId: item.stripePriceId,
    });
  }
};

export const decreaseItem = async (productId: string, cartId: string) => {
  const cartItem = await db.query.cartItems.findFirst({
    where: (cartItems, { and, eq }) =>
      and(eq(cartItems.productId, productId), eq(cartItems.cartId, cartId)),
  });

  if (cartItem) {
    if (cartItem.quantity > 1) {
      await db
        .update(cartItems)
        .set({ quantity: cartItem.quantity - 1 })
        .where(eq(cartItems.id, cartItem.id));
    } else {
      await db.delete(cartItems).where(eq(cartItems.id, cartItem.id));
    }
  }
};

export const clearItem = async (productId: string, cartId: string) => {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.productId, productId), eq(cartItems.cartId, cartId)));
};

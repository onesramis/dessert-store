import type { Cart, CartItem, PlacedOrder, Product } from "$lib/types";

export const api = (customFetch = fetch) => ({
  getProducts: async () => {
    const res = await customFetch("/api/products");
    const data = (await res.json()) as Array<Product>;

    return data;
  },
  getCart: async () => {
    const res = await customFetch("/api/cart");
    const data = (await res.json()) as Cart;

    return data;
  },
  increaseItem: async (item: Omit<CartItem, "quantity">) => {
    const res = await customFetch("/api/cart?action=increase", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to increase item");
    }

    return await res.json();
  },
  decreaseItem: async (productId: string) => {
    const res = await customFetch(`/api/cart?action=decrease`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return await res.json();
  },
  clearItem: async (productId: string) => {
    const res = await customFetch(`/api/cart?action=clear`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return await res.json();
  },
  checkout: async () => {
    const res = await customFetch(`/api/cart/checkout`, {
      method: "POST",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return (await res.json()) as { url: string }; // return redirect url for stripe hosted checkout
  },
  getPlacedOrder: async (sessionId: string) => {
    const res = await customFetch(`/api/orders/${sessionId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return (await res.json()) as PlacedOrder;
  },
});

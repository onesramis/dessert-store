import type { RequestHandler } from "./$types";
import { clearItem, decreaseItem, getCart, increaseItem } from "$lib/server/cart";
import { db } from "$lib/server/db/drizzle";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.session) {
    return Response.json({ items: [] }, { status: 200 });
  }

  const cart = await getCart(locals.session.userId);
  return Response.json(cart, { status: 200 });
};

export const POST: RequestHandler = async ({ locals, request, url }) => {
  if (!locals.session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const action = url.searchParams.get("action");
  if (!action || !["increase", "decrease", "clear"].includes(action)) {
    return Response.json({ message: "Invalid action" }, { status: 400 });
  }

  const item = (await request.json()) as {
    productId: string;
    price: string;
    stripePriceId: string;
  };
  if (!item || !item.productId) {
    return Response.json({ message: "Invalid product" }, { status: 400 });
  }

  const cart = await db.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.userId, locals.session?.userId as string),
  });

  if (!cart) {
    return Response.json({ message: "Cart not found" }, { status: 404 });
  }

  switch (action) {
    case "increase":
      increaseItem(item, cart.id);
      break;
    case "decrease":
      decreaseItem(item.productId, cart.id);
      break;
    case "clear":
      clearItem(item.productId, cart.id);
      break;
  }

  return Response.json(null, { status: 200 });
};

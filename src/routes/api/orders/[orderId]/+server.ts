import { stripe } from "$lib/server/stripe";
import type { PlacedOrder } from "$lib/types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const stripeSession = await stripe.checkout.sessions.retrieve(params.orderId, {
    expand: ["line_items.data.price.product"],
  });

  const placedOrder = {
    id: stripeSession.id,
    total: String((stripeSession.amount_total ?? 0) / 100),
    items: stripeSession.line_items || [],
  } as PlacedOrder;

  return Response.json(placedOrder, { status: 200 });
};

import type Stripe from "stripe";

import type { RequestHandler } from "../$types";
import { getCart } from "$lib/server/cart";
import { stripe } from "$lib/server/stripe";
import { getLocale } from "$lib/paraglide/runtime";

export const POST: RequestHandler = async ({ locals, url }) => {
  if (!locals.session || !locals.user) {
    return new Response(null, { status: 401 });
  }

  const cart = await getCart(locals.session.userId);

  const user = locals.user;
  const currentLocale = getLocale();

  // @ts-expect-error stripeCustomerId actually exists on better-auth user
  const customerId: string | undefined = user.stripeCustomerId ?? undefined;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }));

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    customer: customerId,
    customer_creation: !customerId ? "always" : undefined,
    customer_update: customerId ? { shipping: "auto" } : undefined,
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    locale: currentLocale === "az" ? "auto" : currentLocale,
    success_url: `${url.origin}/${currentLocale}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url.origin}/${currentLocale}?canceled=true`,
    billing_address_collection: "auto",
    metadata: {
      userId: user.id,
      cartId: cart.id || "",
      products: JSON.stringify(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      ),
    },
  });

  if (checkoutSession) {
    return Response.json({ url: checkoutSession.url }, { status: 200 });
  }

  return new Response(null, { status: 422 });
};

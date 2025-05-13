import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { stripe } from "$lib/server/stripe";
import { db } from "$lib/server/db/drizzle";
import { cartItems, orderItems, orders, users } from "$lib/server/db/schema";

function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = view[i];
  }

  return buf;
}

export const POST: RequestHandler = async ({ request }) => {
  const _rawBody = await request.arrayBuffer();
  const payload = toBuffer(_rawBody);

  const signature = request.headers.get("stripe-signature") ?? "";
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err);
    return new Response(null, { status: 400 });
  }

  const eventType = event.type;
  if (eventType === "checkout.session.completed") {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ["customer"],
    });

    if (session.metadata) {
      const products = JSON.parse(session.metadata.products) as {
        productId: string;
        quantity: number;
      }[];

      const customer = session.customer as Stripe.Customer | null;
      const userId = session.metadata.userId as string;

      if (customer) {
        if (userId !== "") {
          await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, userId));
        }
      }

      const [insertedOrder] = await db
        .insert(orders)
        .values({
          stripeOrderId: session.id,
          stripeCustomerId: customer?.id || null,
          total: String((session.amount_total || 0) / 100),
          status: "new",
          userId,
        })
        .returning({ id: orders.stripeOrderId });

      for (const item of products) {
        const product = await db.query.products.findFirst({
          where: (products, { eq }) => eq(products.id, item.productId),
          columns: {
            name: true,
            price: true,
          },
        });

        if (!product) return new Response(null, { status: 404 });

        await db.insert(orderItems).values({
          name: product.name,
          orderId: insertedOrder.id,
          price: product.price,
          quantity: item.quantity,
          productId: item.productId,
        });
      }

      /* Clear the cart after order & items creation */
      const cartId = session.metadata.cartId;
      if (cartId !== "") {
        await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
      }
    }

    // TODO: Create Stripe email reciepts or send email via Resend API
    if (session.customer_details?.email) {
      console.log("Send an email");
    }
  }

  return new Response(null, { status: 200 });
};

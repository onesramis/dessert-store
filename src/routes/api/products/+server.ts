import { db } from "$lib/server/db/drizzle";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const products = await db.query.products.findMany({
    columns: {
      id: true,
      name: true,
      image: true,
      price: true,
      stripePriceId: true,
    },
    with: {
      category: {
        columns: {
          name: true,
        },
      },
    },
  });

  return Response.json(products, { status: 200 });
};

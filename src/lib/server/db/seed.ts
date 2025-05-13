import { config } from "dotenv";
import slugify from "slug";

import data from "$lib/data.json";
import { db } from "$lib/server/db/drizzle";
import { categories, products } from "$lib/server/db/schema";

config({ path: ".env" });

async function main() {
  for (const category of data.categories) {
    await db.insert(categories).values({
      name: category,
      slug: slugify(category),
    });
  }

  for (const product of data.products) {
    const pCategory = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.name, product.category),
      columns: {
        id: true,
      },
    });

    await db.insert(products).values({
      name: product.name,
      image: product.image,
      thumbnail: product.thumbnail,
      price: String(product.price),
      stripePriceId: product.stripePriceId,
      stripeProductId: product.stripeProductId,
      categoryId: pCategory?.id,
    });
  }
}

main();

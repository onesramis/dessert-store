import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { forgotPasswordSchema } from "../lib/schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(forgotPasswordSchema), { errors: false }),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(forgotPasswordSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { email } = form.data;
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: "/reset-password",
      },
    });

    return message(form, { status: "success", text: "Reset link sent!" });
  },
} satisfies Actions;

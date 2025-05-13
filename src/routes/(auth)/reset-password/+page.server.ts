import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { m } from "$lib/paraglide/messages";
import { resetPasswordSchema } from "../lib/schema";

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get("token");

  return {
    token,
    form: await superValidate(zod(resetPasswordSchema), { errors: false }),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(resetPasswordSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { token, password } = form.data;
    if (!token) {
      return message(form, { status: "error", text: m["forms.errors.token-missing"]() });
    }

    try {
      await auth.api.resetPassword({
        body: {
          token,
          newPassword: password,
        },
      });
    } catch {
      return message(form, { status: "error", text: m["forms.errors.unexpected"]() });
    }

    return message(form, { status: "success", text: "Your password has been reset!" });
  },
} satisfies Actions;

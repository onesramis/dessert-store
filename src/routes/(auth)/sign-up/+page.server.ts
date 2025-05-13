import { fail } from "@sveltejs/kit";
import { APIError } from "better-auth/api";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";
import { m } from "$lib/paraglide/messages";
import { auth } from "$lib/server/auth";
import { registerSchema } from "../lib/schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(registerSchema), { errors: false }),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;
    try {
      await auth.api.signUpEmail({
        body: {
          name: "",
          email,
          password,
        },
      });
    } catch (err) {
      if (err instanceof APIError) {
        if (err.body?.code === "USER_ALREADY_EXISTS") {
          return setError(form, "email", m["forms.errors.email.already-taken"]());
        }

        return message(
          form,
          { status: "error", text: m["forms.errors.unexpected"]() },
          { status: 400 },
        );
      }
    }

    return message(form, { status: "success", text: m["forms.messages.verification"]() });
  },
} satisfies Actions;

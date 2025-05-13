import { fail } from "@sveltejs/kit";
import { parseSetCookieHeader } from "better-auth/cookies";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { m } from "$lib/paraglide/messages";
import { loginSchema } from "../lib/schema";

export const load: PageServerLoad = async ({ url }) => {
  return {
    redirectTo: url.searchParams.get("redirectTo") || "/",
    form: await superValidate(zod(loginSchema), { errors: false }),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });
    if (res.status === 401) {
      return message(
        form,
        { status: "error", text: m["forms.errors.credentials"]() },
        {
          status: 401,
        },
      );
    }

    if (res.status === 403) {
      return message(
        form,
        { status: "error", shouldVerify: true },
        {
          status: 403,
        },
      );
    }

    if (!res.ok) {
      return message(
        form,
        { status: "error", text: m["forms.errors.unexpected"]() },
        {
          status: 400,
        },
      );
    }

    const resHeaders = res.headers;
    const setCookies = resHeaders.get("set-cookie");
    if (!setCookies) return;

    const parsed = parseSetCookieHeader(setCookies);
    parsed.forEach((value, key) => {
      if (!key) return;
      const opts = {
        sameSite: value.samesite,
        secure: value.secure,
        maxAge: value["max-age"],
        httpOnly: value.httponly,
        domain: value.domain,
        path: value.path as string,
      } as const;

      event.cookies.set(key, decodeURIComponent(value.value), opts);
    });

    return message(form, { status: "success", text: "Logged In!" });
  },
} satisfies Actions;

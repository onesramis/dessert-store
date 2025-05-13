import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";

import { auth } from "$lib/server/auth";
import { paraglideMiddleware } from "$lib/paraglide/server";

const handleAuth: Handle = ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth });
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale),
    });
  });

const authentication: Handle = async ({ event, resolve }) => {
  const isAuthed = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (isAuthed) {
    event.locals.session = isAuthed.session;
    event.locals.user = isAuthed.user;
  }

  return resolve(event);
};

export const handle: Handle = sequence(handleAuth, authentication, handleParaglide);

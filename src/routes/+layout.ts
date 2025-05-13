import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";

export const load = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000, // 1 minutes
      },
    },
  });

  return {
    queryClient,
  };
};

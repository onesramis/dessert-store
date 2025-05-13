import { api } from "$lib/api";

export const load = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => api(fetch).getProducts(),
  });
};

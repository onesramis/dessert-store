<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto, preloadData } from "$app/navigation";
  import { type Infer, type SuperValidated } from "sveltekit-superforms";

  import type { LoginSchema } from "../../routes/(auth)/lib/schema";
  import type { PageData } from "../../routes/(auth)/sign-in/$types";

  import { Dialog, DialogContent } from "$lib/components/ui/dialog";
  import LoginForm from "../../routes/(auth)/components/login-form.svelte";

  let open = $state<boolean | undefined>(false);
  let data = $state<
    | {
        redirectTo: string;
        form: SuperValidated<Infer<LoginSchema>>;
      }
    | undefined
  >(undefined);

  const onOpenChange = (value: boolean) => {
    open = value;
    history.back();
  };

  onMount(async () => {
    const result = await preloadData("/sign-in");

    if (result.type === "loaded" && result.status === 200) {
      data = result.data as PageData;
      open = page.state.loginModal;
    } else {
      goto("/sign-in?redirectTo=/");
    }
  });
</script>

<Dialog {open} {onOpenChange}>
  <DialogContent class="sm:px-12 sm:py-10">
    <LoginForm data={data as PageData} modal />
  </DialogContent>
</Dialog>

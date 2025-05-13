<script lang="ts">
  import { authClient } from "$lib/auth-client";

  import googleIcon from "$lib/assets/google.svg";
  import githubIcon from "$lib/assets/github.svg";
  import { localizeHref } from "$lib/paraglide/runtime";

  import { Button, type ButtonProps } from "$lib/components/ui/button";

  type Props = Omit<ButtonProps, "onclick" | "children"> & {
    provider: "google" | "github";
    label?: string;
    redirectTo?: string;
  };

  let { provider, label, redirectTo = "/", ...restProps }: Props = $props();

  const onProviderSignIn = async () => {
    await authClient.signIn.social({ provider, callbackURL: localizeHref(redirectTo) });
  };
</script>

{#snippet button(icon: string, provider: string, label?: string)}
  <Button {...restProps} onclick={onProviderSignIn}>
    <img src={icon} alt={provider} class="size-[18px]" />
    {label || provider}
  </Button>
{/snippet}

{#if provider === "google"}
  {@render button(googleIcon, "Google", label)}
{:else if provider === "github"}
  {@render button(githubIcon, "Github", label)}
{/if}

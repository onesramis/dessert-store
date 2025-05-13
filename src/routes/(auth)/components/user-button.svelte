<script lang="ts">
  import { goto } from "$app/navigation";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { LoaderIcon, LogInIcon, LogOutIcon, SettingsIcon, UserIcon } from "@lucide/svelte";

  import { cn } from "$lib/utils";
  import { authClient } from "$lib/auth-client";
  import type { Cart } from "$lib/types";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";

  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";

  const session = authClient.useSession();
  const queryClient = useQueryClient();

  const onSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.setQueryData<Cart>(["cart"], { id: undefined, items: [] });
          window.location.reload();
        },
      },
    });
  };
</script>

{#if $session.isPending}
  <div class="text-gray-400 flex h-10 items-center justify-start gap-2 px-3">
    <LoaderIcon class="size-4 animate-spin" />
  </div>
{:else if $session.data}
  {@const userImage = $session.data.user.image || "/assets/images/avatar.svg"}
  {@const userName = $session.data.user.name || $session.data.user.email}

  <DropdownMenu>
    <DropdownMenuTrigger
      class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
    >
      <Avatar class="size-8">
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[220px] border-input">
      <DropdownMenuItem>
        <UserIcon />
        {m["user-button.profile"]()}
      </DropdownMenuItem>
      <DropdownMenuItem>
        <SettingsIcon />
        {m["user-button.settings"]()}
      </DropdownMenuItem>
      <DropdownMenuSeparator class="bg-input" />
      <DropdownMenuItem onSelect={onSignOut}>
        <LogOutIcon />
        {m["user-button.log-out"]()}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{:else}
  <Button
    variant="ghost"
    size="lg"
    class="group justify-start rounded-full px-4"
    aria-label="Sign In"
    onclick={() => goto(localizeHref("/sign-in"))}
  >
    <LogInIcon />
    <span class="hidden sm:inline">Sign In</span>
  </Button>
{/if}

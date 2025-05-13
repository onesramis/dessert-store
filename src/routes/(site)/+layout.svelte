<script lang="ts">
  import { page } from "$app/state";

  import logo from "$lib/assets/dessert-logo.svg";
  import LoginModal from "$lib/components/LoginModal.svelte";
  import LocalePicker from "$lib/components/LocalePicker.svelte";
  import UserButton from "../(auth)/components/user-button.svelte";
  import Cart from "$lib/components/Cart.svelte";
  import OrderConfirmModal from "$lib/components/OrderConfirmModal.svelte";

  let { children } = $props();
</script>

{#if page.state.loginModal}
  <LoginModal />
{/if}

<OrderConfirmModal />

<div class="site-layout">
  <header class="site-header">
    <a href="/">
      <img src={logo} alt="Logo" />
    </a>

    <div class="flex items-center gap-4">
      <LocalePicker />
      <UserButton />
    </div>
  </header>
  <main class="site-content">
    {@render children()}
    <Cart />
  </main>
</div>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    background-color: hsl(var(--color-white));
    padding-inline: clamp(1rem, 4vw, 2rem);
  }

  .site-content {
    display: grid;
    gap: 1.5rem;
    align-items: start;
    max-width: 1200px;
    width: 100%;
    margin-inline: auto;
    padding-inline: clamp(1.5rem, 5vw, 2.5rem);
    padding-block: 2rem;
  }

  @media screen and (min-width: 640px) {
    .site-content {
      gap: 2rem;
    }
  }

  @media screen and (min-width: 1280px) {
    .site-layout {
      height: 100vh;
      overflow: hidden;
    }

    .site-content {
      grid-template-columns: 1fr 384px;
      padding-inline: 0;
    }
  }
</style>

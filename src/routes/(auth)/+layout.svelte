<script lang="ts">
  import LocalePicker from "$lib/components/LocalePicker.svelte";

  let { children } = $props();
</script>

<div class="auth-layout">
  <LocalePicker class="fixed right-4 top-4" />
  <div class="auth-content">
    {@render children()}
  </div>
</div>

<style>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-content {
    width: 100%;
    max-width: 520px;
    padding-inline: 1rem;
    padding-block: 1rem;
    border-radius: 12px;
  }

  @media screen and (min-width: 640px) {
    .auth-content {
      padding-inline: 3rem;
      padding-block: 2.5rem;
      background-color: hsl(var(--color-white));
    }
  }
</style>

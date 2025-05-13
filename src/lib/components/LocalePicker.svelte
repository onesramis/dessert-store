<script lang="ts">
  import { getLocale, setLocale, type Locale } from "$lib/paraglide/runtime";

  import * as Select from "$lib/components/ui/select";

  const flags: Record<string, string> = {
    en: "/assets/images/en-flag.svg",
    es: "/assets/images/es-flag.svg",
    fr: "/assets/images/fr-flag.svg",
    az: "/assets/images/az-flag.svg",
  };

  const locales = [
    { value: "en", label: "en" },
    { value: "es", label: "es" },
    { value: "fr", label: "fr" },
    { value: "az", label: "az" },
  ];

  let locale = $state(getLocale());

  type Props = {
    class?: string;
  };

  let { class: className }: Props = $props();
</script>

<Select.Root
  type="single"
  bind:value={locale}
  onValueChange={(value) => setLocale(value as Locale)}
>
  <Select.Trigger class={["w-[100px] rounded-full border-none shadow-none", className]}>
    <img src={flags[locale]} alt="" class="size-4" />
    <p class="text-sm font-medium tracking-wide">{locale.toUpperCase()}</p>
  </Select.Trigger>
  <Select.Content class="min-w-0 rounded-lg border-none">
    {#each locales as locale (locale.value)}
      <Select.Item value={locale.value} class="rounded-md">
        <img src={flags[locale.value]} alt="" class="size-4" />
        <p class="ml-2 text-sm font-normal tracking-wide">{locale.label.toUpperCase()}</p>
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>

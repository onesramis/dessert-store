<script lang="ts">
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Loader2Icon, MailIcon } from "@lucide/svelte";

  import logo from "$lib/assets/dessert-logo.svg";
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { forgotPasswordSchema, type ForgotPasswordSchema } from "../lib/schema";

  import * as Form from "$lib/components/ui/form";
  import { TextInput } from "$lib/components/form/text-input";

  let { data }: { data: { form: SuperValidated<Infer<ForgotPasswordSchema>> } } = $props();

  let form = superForm(data.form, {
    validators: zodClient(forgotPasswordSchema),
  });

  const { form: formData, enhance, delayed, message } = form;
</script>

{#if $message && $message.status === "success"}
  <div class="space-y-6">
    <div class="flex flex-col items-center gap-4 text-center">
      <a href={localizeHref("/")}>
        <img src={logo} alt="Dessert Logo" />
      </a>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">{m["forms.messages.reset-link"]()}</h1>
        <p class="text-sm font-semibold text-rose">
          {m["forms.messages.reset-link-text"]()}
        </p>
      </div>
    </div>

    <MailIcon class="mx-auto size-8 animate-bounce text-green" />

    <p class="text-center text-sm font-medium text-rose-400">
      <a href={localizeHref("/sign-in")} class="underline-offset-[3px] hover:underline">
        {m["forms.back-to-login"]()}
      </a>
    </p>
  </div>
{:else}
  <div class="space-y-6">
    <div class="flex flex-col items-center gap-3 text-center">
      <a href={localizeHref("/")} class={[$delayed && "pointer-events-none"]}>
        <img src={logo} alt="Logo" />
      </a>
      <div class="space-y-1 font-semibold">
        <h1 class="text-[1.25rem]">{m["forms.forgot-password.title"]()}</h1>
        <p class="text-sm text-rose">{m["forms.forgot-password.subtitle"]()}</p>
      </div>
    </div>

    <div class="space-y-4">
      <form method="POST" class="space-y-6" use:enhance>
        <div class="space-y-4">
          <Form.Field {form} name="email">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>{m["forms.fields.email.label"]()}</Form.Label>
                <TextInput {...props} bind:value={$formData.email} disabled={$delayed} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <Form.Button variant="primary" size="lg" disabled={$delayed} class="w-full rounded-full">
          {#if $delayed}
            <Loader2Icon class="animate-spin" />
            {m["forms.processing"]()}
          {:else}
            {m["forms.forgot-password.submit"]()}
          {/if}
        </Form.Button>
      </form>

      <p class="text-center text-sm font-medium text-rose-400">
        <a
          href={localizeHref("/sign-in")}
          class={["underline-offset-[3px] hover:underline", $delayed && "pointer-events-none"]}
        >
          {m["forms.back-to-login"]()}
        </a>
      </p>
    </div>
  </div>
{/if}

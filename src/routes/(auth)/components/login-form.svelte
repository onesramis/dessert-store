<script lang="ts">
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Loader2Icon, MailIcon } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  import logo from "$lib/assets/dessert-logo.svg";
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { loginSchema, type LoginSchema } from "../lib/schema";

  import * as Form from "$lib/components/ui/form";
  import OauthButton from "./oauth-button.svelte";
  import { TextInput } from "$lib/components/form/text-input";
  import { PasswordInput } from "$lib/components/form/password-input";

  let {
    data,
    modal = false,
  }: { data: { redirectTo: string; form: SuperValidated<Infer<LoginSchema>> }; modal?: boolean } =
    $props();

  let form = superForm(data.form, {
    applyAction: false,
    validators: zodClient(loginSchema),
    onUpdated: ({ form }) => {
      if (form.message?.status === "error" && form.message.text) {
        return toast.error(form.message.text);
      }
    },
    onResult: ({ result }) => {
      if (result.type === "success") {
        window.location.assign(localizeHref(data.redirectTo));
      }
    },
  });

  const { form: formData, enhance, delayed, message, reset } = form;
</script>

{#if $message && $message.status === "error" && $message.shouldVerify}
  <div class="space-y-6">
    <div class="flex flex-col items-center gap-4 text-center">
      <a href={localizeHref("/")}>
        <img src={logo} alt="Dessert Logo" />
      </a>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">{m["forms.messages.verification"]()}</h1>
        <p class="text-sm font-semibold text-rose">
          {m["forms.messages.verification-text"]()}
        </p>
      </div>
    </div>

    <MailIcon class="mx-auto size-8 animate-bounce text-green" />

    <p class="text-center text-sm font-medium text-rose-400">
      <a
        href={localizeHref("/sign-in")}
        class="underline-offset-[3px] hover:underline"
        onclick={(e) => {
          if (modal) {
            e.preventDefault();
          }

          reset({
            keepMessage: false,
            data: {
              email: "",
              password: "",
            },
          });
        }}
      >
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
        <h1 class="text-[1.25rem]">{m["forms.sign-in.title"]()}</h1>
        <p class="text-sm text-rose">{m["forms.sign-in.subtitle"]()}</p>
      </div>
    </div>

    <OauthButton
      provider="google"
      label={m["forms.google"]()}
      redirectTo={data.redirectTo}
      variant="outline"
      size="lg"
      disabled={$delayed}
      class="w-full rounded-full"
    />

    <div class="flex w-full items-center">
      <div class="h-px w-full bg-rose-200"></div>
      <p class="mx-3 flex-shrink-0 text-sm font-medium text-rose-300">{m["forms.or"]()}</p>
      <div class="h-px w-full bg-rose-200"></div>
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

          <Form.Field {form} name="password">
            <Form.Control>
              {#snippet children({ props })}
                <div class="relative">
                  <Form.Label>{m["forms.fields.password.label"]()}</Form.Label>
                  {#if modal}
                    <a
                      href={localizeHref("/forgot-password")}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="absolute right-0 top-1 text-xs font-medium text-rose-400 underline-offset-[3px] hover:underline"
                    >
                      {m["forms.sign-in.forgot-password"]()}
                    </a>
                  {:else}
                    <a
                      href={localizeHref("/forgot-password")}
                      class="absolute right-0 top-1 text-xs font-medium text-rose-400 underline-offset-[3px] hover:underline"
                    >
                      {m["forms.sign-in.forgot-password"]()}
                    </a>
                  {/if}
                </div>
                <PasswordInput {...props} bind:value={$formData.password} disabled={$delayed} />
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
            {m["forms.sign-in.submit"]()}
          {/if}
        </Form.Button>
      </form>

      <p class="text-center text-sm font-medium text-rose-400">
        {m["forms.sign-in.already-member"]()}{" "}
        {#if modal}
          <a
            href={localizeHref("/sign-up")}
            target="_blank"
            rel="noopener noreferrer"
            class={[
              "ml-1.5 font-semibold text-orange underline-offset-[3px] hover:underline",
              $delayed && "pointer-events-none",
            ]}
          >
            {m["forms.sign-in.alternative-method"]()}
          </a>
        {:else}
          <a
            href={localizeHref("/sign-up")}
            rel="noopener noreferrer"
            class={[
              "ml-1.5 font-semibold text-orange underline-offset-[3px] hover:underline",
              $delayed && "pointer-events-none",
            ]}
          >
            {m["forms.sign-in.alternative-method"]()}
          </a>
        {/if}
      </p>
    </div>
  </div>
{/if}

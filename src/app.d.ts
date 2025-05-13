// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: import("better-auth").Session | null;
      user: import("better-auth").User | null;
    }
    // interface PageData {}
    interface PageState {
      loginModal?: boolean;
    }
    // interface Platform {}

    namespace Superforms {
      type Message =
        | { status: "success"; text: string }
        | { status: "error"; text?: string; shouldVerify?: boolean }
        | undefined;
    }
  }
}

export {};

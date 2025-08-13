import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.208.0/testing/mock.ts";
import {
  validatePayPalPaymentLink,
  validateATHMovilPaymentLink,
  ensureEntitlement,
} from "./index.ts";

Deno.test("validatePayPalPaymentLink success", async () => {
  Deno.env.set("PAYPAL_CLIENT_ID", "id");
  Deno.env.set("PAYPAL_CLIENT_SECRET", "secret");

  const responses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200 }),
    new Response(JSON.stringify({ state: "approved" }), { status: 200 }),
  ];

  const fetchStub = stub(globalThis, "fetch", (_input, _init) => responses.shift()!);

  const result = await validatePayPalPaymentLink("PAY-1");
  assertEquals(result, { valid: true, status: "approved" });

  fetchStub.restore();
});

Deno.test("validatePayPalPaymentLink configuration error", async () => {
  Deno.env.delete("PAYPAL_CLIENT_ID");
  Deno.env.delete("PAYPAL_CLIENT_SECRET");

  const result = await validatePayPalPaymentLink("PAY-1");
  assertEquals(result.valid, false);
  assertEquals(result.status, "configuration_error");
});

Deno.test("validateATHMovilPaymentLink not found", async () => {
  Deno.env.set("ATH_MOVIL_API_KEY", "key");
  Deno.env.set("ATH_MOVIL_MERCHANT_ID", "merchant");

  const resp = new Response("", { status: 404 });
  const fetchStub = stub(globalThis, "fetch", () => resp);

  const result = await validateATHMovilPaymentLink("ATH-1");
  assertEquals(result.valid, false);
  assertEquals(result.status, "not_found");

  fetchStub.restore();
});

Deno.test("validateATHMovilPaymentLink success", async () => {
  Deno.env.set("ATH_MOVIL_API_KEY", "key");
  Deno.env.set("ATH_MOVIL_MERCHANT_ID", "merchant");

  const resp = new Response(JSON.stringify({ status: "COMPLETED" }), { status: 200 });
  const fetchStub = stub(globalThis, "fetch", () => resp);

  const result = await validateATHMovilPaymentLink("ATH-2");
  assertEquals(result, { valid: true, status: "COMPLETED" });

  fetchStub.restore();
});

Deno.test("ensureEntitlement throws when active", async () => {
  const mockSupabase = {
    from: (_table: string) => ({
      select: (_: string) => ({
        eq: (_: string, __: string) => ({
          eq: (_: string, __: string) => ({
            maybeSingle: () => Promise.resolve({ data: { id: 1, status: "active" }, error: null }),
          }),
        }),
      }),
    }),
  } as any;

  await assertRejects(
    () => ensureEntitlement(mockSupabase, "cust", "premium"),
    Error,
    "Entitlement already active",
  );
});

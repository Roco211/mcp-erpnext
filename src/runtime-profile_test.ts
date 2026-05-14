import { assertEquals, assertThrows } from "@std/assert";
import {
  AI_ERP_READONLY_PROFILE,
  AI_ERP_READONLY_TOOLS,
  resolveRuntimeProfile,
} from "./runtime-profile.ts";

Deno.test("resolveRuntimeProfile - leaves default filters unchanged", () => {
  const result = resolveRuntimeProfile({
    categories: ["setup"],
    toolNames: ["erpnext_company_list"],
    readOnlyOnly: true,
  });

  assertEquals(result.profileApplied, false);
  assertEquals(result.clientOptions.categories, ["setup"]);
  assertEquals(result.clientOptions.toolNames, ["erpnext_company_list"]);
  assertEquals(result.clientOptions.readOnlyOnly, true);
});

Deno.test("resolveRuntimeProfile - ai-erp-readonly overrides manual filters", () => {
  const result = resolveRuntimeProfile({
    profile: AI_ERP_READONLY_PROFILE,
    categories: ["sales"],
    toolNames: ["erpnext_customer_list"],
    readOnlyOnly: false,
  });

  assertEquals(result.profileApplied, true);
  assertEquals(result.profileName, AI_ERP_READONLY_PROFILE);
  assertEquals(result.clientOptions.categories, undefined);
  assertEquals(result.clientOptions.toolNames, AI_ERP_READONLY_TOOLS);
  assertEquals(result.clientOptions.readOnlyOnly, true);
});

Deno.test("resolveRuntimeProfile - rejects unknown profile", () => {
  assertThrows(
    () => resolveRuntimeProfile({ profile: "wide-open" }),
    Error,
    "Unknown ERPNEXT_MCP_PROFILE",
  );
});

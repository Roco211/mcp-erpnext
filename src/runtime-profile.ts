import type { ErpNextToolsClientOptions } from "./client.ts";

export const AI_ERP_READONLY_PROFILE = "ai-erp-readonly";

export const AI_ERP_READONLY_TOOLS = [
  "erpnext_company_list",
  "erpnext_item_list",
  "erpnext_warehouse_list",
  "erpnext_item_group_list",
  "erpnext_uom_list",
  "erpnext_brand_list",
];

export interface RuntimeProfileInput extends ErpNextToolsClientOptions {
  profile?: string;
}

export interface RuntimeProfileResolution {
  clientOptions: ErpNextToolsClientOptions;
  profileApplied: boolean;
  profileName?: string;
}

export function resolveRuntimeProfile(
  input: RuntimeProfileInput,
): RuntimeProfileResolution {
  const profile = input.profile?.trim();
  if (!profile) {
    return {
      clientOptions: {
        categories: input.categories,
        toolNames: input.toolNames,
        readOnlyOnly: input.readOnlyOnly,
      },
      profileApplied: false,
    };
  }

  if (profile !== AI_ERP_READONLY_PROFILE) {
    throw new Error(
      `Unknown ERPNEXT_MCP_PROFILE '${profile}'. Supported profiles: ${AI_ERP_READONLY_PROFILE}`,
    );
  }

  return {
    clientOptions: {
      toolNames: [...AI_ERP_READONLY_TOOLS],
      readOnlyOnly: true,
    },
    profileApplied: true,
    profileName: AI_ERP_READONLY_PROFILE,
  };
}

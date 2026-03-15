import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";
import { buildParams, jsonResponse } from "../helpers.js";

export function registerCapabilityTools(server: McpServer) {
  server.tool(
    "list_bundle_id_capabilities",
    "List capabilities enabled for a bundle ID.",
    {
      bundle_id: z.string().describe("The bundle ID resource ID"),
      limit: z.coerce.number().min(1).max(200).optional(),
    },
    async ({ bundle_id, limit }) => {
      const params = buildParams({
        "limit": limit,
      });

      const response = await apiRequest(
        "GET",
        `/v1/bundleIds/${bundle_id}/bundleIdCapabilities`,
        undefined,
        params
      );

      return jsonResponse(response);
    }
  );

  server.tool(
    "enable_bundle_id_capability",
    "Enable a capability for a bundle ID (e.g., push notifications, sign in with Apple).",
    {
      bundle_id: z.string().describe("The bundle ID resource ID"),
      capabilityType: z
        .enum(["ICLOUD", "IN_APP_PURCHASE", "GAME_CENTER", "PUSH_NOTIFICATIONS", "WALLET", "INTER_APP_AUDIO", "MAPS", "ASSOCIATED_DOMAINS", "PERSONAL_VPN", "APP_GROUPS", "HEALTHKIT", "HOMEKIT", "WIRELESS_ACCESSORY_CONFIGURATION", "APPLE_PAY", "DATA_PROTECTION", "SIRIKIT", "NETWORK_EXTENSIONS", "MULTIPATH", "HOT_SPOT", "NFC_TAG_READING", "CLASSKIT", "AUTOFILL_CREDENTIAL_PROVIDER", "ACCESS_WIFI_INFORMATION", "NETWORK_CUSTOM_PROTOCOL", "COREMEDIA_HLS_LOW_LATENCY", "SYSTEM_EXTENSION_INSTALL", "USER_MANAGEMENT", "APPLE_ID_AUTH"])
        .describe(
          "Capability type to enable"
        ),
    },
    async ({ bundle_id, capabilityType }) => {
      const body = {
        data: {
          type: "bundleIdCapabilities",
          attributes: {
            capabilityType,
          },
          relationships: {
            bundleId: {
              data: {
                type: "bundleIds",
                id: bundle_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/bundleIdCapabilities",
        body
      );

      return jsonResponse(response);
    }
  );

  server.tool(
    "disable_bundle_id_capability",
    "Disable (delete) a capability from a bundle ID.",
    {
      capability_id: z.string().describe("The capability ID to disable"),
    },
    async ({ capability_id }) => {
      await apiRequest(
        "DELETE",
        `/v1/bundleIdCapabilities/${capability_id}`
      );

      return jsonResponse({
        success: true,
        message: `Capability ${capability_id} disabled`,
      });
    }
  );
}

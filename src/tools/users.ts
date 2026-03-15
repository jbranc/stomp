import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";
import { buildParams, jsonResponse } from "../helpers.js";

export function registerUserTools(server: McpServer) {
  server.tool(
    "list_users",
    "List users in your App Store Connect team.",
    {
      filter_roles: z
        .string()
        .optional()
        .describe(
          "Comma-separated roles to filter by (e.g., ADMIN,APP_MANAGER,DEVELOPER)"
        ),
      filter_username: z.string().optional().describe("Filter by username (email)"),
      include: z
        .string()
        .optional()
        .describe("Comma-separated includes (e.g., visibleApps)"),
      limit: z.coerce.number().min(1).max(200).optional(),
    },
    async ({ filter_roles, filter_username, include, limit }) => {
      const params = buildParams({
        "filter[roles]": filter_roles,
        "filter[username]": filter_username,
        "include": include,
        "limit": limit,
      });

      const response = await apiRequest("GET", "/v1/users", undefined, params);

      return jsonResponse(response);
    }
  );

  server.tool(
    "list_devices",
    "List registered devices.",
    {
      filter_name: z.string().optional().describe("Filter by device name"),
      filter_platform: z
        .enum(["IOS", "MAC_OS"])
        .optional()
        .describe("Filter by platform"),
      filter_status: z
        .enum(["ENABLED", "DISABLED"])
        .optional()
        .describe("Filter by status"),
      filter_udid: z.string().optional().describe("Filter by UDID"),
      limit: z.coerce.number().min(1).max(200).optional(),
    },
    async ({ filter_name, filter_platform, filter_status, filter_udid, limit }) => {
      const params = buildParams({
        "filter[name]": filter_name,
        "filter[platform]": filter_platform,
        "filter[status]": filter_status,
        "filter[udid]": filter_udid,
        "limit": limit,
      });

      const response = await apiRequest("GET", "/v1/devices", undefined, params);

      return jsonResponse(response);
    }
  );
}

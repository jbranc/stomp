import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";

export function registerAppClipTools(server: McpServer) {
  server.tool(
    "list_app_clips",
    "List App Clips for an app.",
    {
      app_id: z.string().describe("The App Store Connect app ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ app_id, limit }) => {
      const params: Record<string, string> = {
        include: "appClipDefaultExperiences",
      };
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/apps/${app_id}/appClips`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_app_clip",
    "Get details of a specific App Clip.",
    {
      id: z.string().describe("The App Clip ID"),
    },
    async ({ id }) => {
      const params: Record<string, string> = {
        include: "appClipDefaultExperiences",
      };

      const response = await apiRequest(
        "GET",
        `/v1/appClips/${id}`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_app_clip_default_experiences",
    "List default experiences for an App Clip.",
    {
      clip_id: z.string().describe("The App Clip ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ clip_id, limit }) => {
      const params: Record<string, string> = {
        include: "appClipDefaultExperienceLocalizations",
      };
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appClips/${clip_id}/appClipDefaultExperiences`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_app_clip_default_experience",
    "Create a default experience for an App Clip.",
    {
      clip_id: z.string().describe("The App Clip ID"),
      appStoreVersion_id: z
        .string()
        .describe("The App Store version ID to associate this experience with"),
      action: z
        .enum(["OPEN"])
        .optional()
        .default("OPEN")
        .describe("The action for the default experience"),
    },
    async ({ clip_id, appStoreVersion_id, action }) => {
      const body = {
        data: {
          type: "appClipDefaultExperiences",
          attributes: {
            action,
          },
          relationships: {
            appClip: {
              data: {
                type: "appClips",
                id: clip_id,
              },
            },
            appStoreVersion: {
              data: {
                type: "appStoreVersions",
                id: appStoreVersion_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appClipDefaultExperiences",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "update_app_clip_default_experience",
    "Update a default experience for an App Clip.",
    {
      id: z.string().describe("The App Clip default experience ID"),
      action: z.enum(["OPEN"]).optional().describe("Updated action"),
    },
    async ({ id, action }) => {
      const attributes: Record<string, unknown> = {};
      if (action !== undefined) attributes.action = action;

      const body = {
        data: {
          type: "appClipDefaultExperiences",
          id,
          attributes,
        },
      };

      const response = await apiRequest(
        "PATCH",
        `/v1/appClipDefaultExperiences/${id}`,
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_app_clip_default_experience",
    "Delete a default experience for an App Clip.",
    {
      id: z.string().describe("The App Clip default experience ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appClipDefaultExperiences/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted App Clip default experience ${id}`,
            }),
          },
        ],
      };
    }
  );
}

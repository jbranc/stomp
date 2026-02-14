import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";

export function registerPhasedReleaseTools(server: McpServer) {
  server.tool(
    "get_phased_release",
    "Get the phased release status for an App Store version.",
    {
      version_id: z.string().describe("The App Store version ID"),
    },
    async ({ version_id }) => {
      const response = await apiRequest(
        "GET",
        `/v1/appStoreVersions/${version_id}/appStoreVersionPhasedRelease`
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_phased_release",
    "Create a phased release for an App Store version. Rolls out to users gradually over 7 days.",
    {
      version_id: z.string().describe("The App Store version ID"),
      phasedReleaseState: z
        .enum(["INACTIVE", "ACTIVE"])
        .describe("Initial phased release state (INACTIVE to create without starting, ACTIVE to begin rollout)"),
    },
    async ({ version_id, phasedReleaseState }) => {
      const body = {
        data: {
          type: "appStoreVersionPhasedReleases",
          attributes: {
            phasedReleaseState,
          },
          relationships: {
            appStoreVersion: {
              data: {
                type: "appStoreVersions",
                id: version_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appStoreVersionPhasedReleases",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "update_phased_release",
    "Update a phased release state. Use PAUSED to halt rollout, ACTIVE to resume, or COMPLETE to release to all users.",
    {
      id: z.string().describe("The phased release ID"),
      phasedReleaseState: z
        .enum(["ACTIVE", "PAUSED", "COMPLETE"])
        .describe("New phased release state"),
    },
    async ({ id, phasedReleaseState }) => {
      const body = {
        data: {
          type: "appStoreVersionPhasedReleases",
          id,
          attributes: {
            phasedReleaseState,
          },
        },
      };

      const response = await apiRequest(
        "PATCH",
        `/v1/appStoreVersionPhasedReleases/${id}`,
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_phased_release",
    "Delete a phased release configuration from an App Store version.",
    {
      id: z.string().describe("The phased release ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appStoreVersionPhasedReleases/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted phased release ${id}`,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "create_version_release_request",
    "Manually release a version that is waiting for developer release. Triggers immediate release to the App Store.",
    {
      version_id: z.string().describe("The App Store version ID to release"),
    },
    async ({ version_id }) => {
      const body = {
        data: {
          type: "appStoreVersionReleaseRequests",
          relationships: {
            appStoreVersion: {
              data: {
                type: "appStoreVersions",
                id: version_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appStoreVersionReleaseRequests",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );
}

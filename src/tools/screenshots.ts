import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";

export function registerScreenshotTools(server: McpServer) {
  // --- Screenshot Sets ---

  server.tool(
    "list_screenshot_sets",
    "List app screenshot sets for an App Store version localization.",
    {
      localization_id: z
        .string()
        .describe("The App Store version localization ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ localization_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appStoreVersionLocalizations/${localization_id}/appScreenshotSets`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_screenshot_set",
    "Create a new screenshot set for an App Store version localization.",
    {
      localization_id: z
        .string()
        .describe("The App Store version localization ID"),
      screenshotDisplayType: z
        .string()
        .describe(
          "The display type (e.g., APP_IPHONE_67, APP_IPHONE_65, APP_IPAD_PRO_3GEN_129, APP_DESKTOP, etc.)"
        ),
    },
    async ({ localization_id, screenshotDisplayType }) => {
      const body = {
        data: {
          type: "appScreenshotSets",
          attributes: {
            screenshotDisplayType,
          },
          relationships: {
            appStoreVersionLocalization: {
              data: {
                type: "appStoreVersionLocalizations",
                id: localization_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appScreenshotSets",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_screenshot_set",
    "Delete an app screenshot set.",
    {
      id: z.string().describe("The app screenshot set ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appScreenshotSets/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted screenshot set ${id}`,
            }),
          },
        ],
      };
    }
  );

  // --- Screenshots ---

  server.tool(
    "list_screenshots",
    "List screenshots within a screenshot set.",
    {
      set_id: z.string().describe("The app screenshot set ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ set_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appScreenshotSets/${set_id}/appScreenshots`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_screenshot",
    "Create a new screenshot (initiates upload). After creation, use the upload operations from the response to upload the image data.",
    {
      set_id: z.string().describe("The app screenshot set ID"),
      fileName: z.string().describe("The file name of the screenshot"),
      fileSize: z.number().describe("The file size in bytes"),
    },
    async ({ set_id, fileName, fileSize }) => {
      const body = {
        data: {
          type: "appScreenshots",
          attributes: {
            fileName,
            fileSize,
          },
          relationships: {
            appScreenshotSet: {
              data: {
                type: "appScreenshotSets",
                id: set_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appScreenshots",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_screenshot",
    "Delete an app screenshot.",
    {
      id: z.string().describe("The app screenshot ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appScreenshots/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted screenshot ${id}`,
            }),
          },
        ],
      };
    }
  );

  // --- Preview Sets ---

  server.tool(
    "list_preview_sets",
    "List app preview sets for an App Store version localization.",
    {
      localization_id: z
        .string()
        .describe("The App Store version localization ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ localization_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appStoreVersionLocalizations/${localization_id}/appPreviewSets`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_preview_set",
    "Create a new app preview set for an App Store version localization.",
    {
      localization_id: z
        .string()
        .describe("The App Store version localization ID"),
      previewType: z
        .string()
        .describe(
          "The preview type (e.g., IPHONE_67, IPHONE_65, IPAD_PRO_3GEN_129, DESKTOP, etc.)"
        ),
    },
    async ({ localization_id, previewType }) => {
      const body = {
        data: {
          type: "appPreviewSets",
          attributes: {
            previewType,
          },
          relationships: {
            appStoreVersionLocalization: {
              data: {
                type: "appStoreVersionLocalizations",
                id: localization_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appPreviewSets",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_preview_set",
    "Delete an app preview set.",
    {
      id: z.string().describe("The app preview set ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appPreviewSets/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted preview set ${id}`,
            }),
          },
        ],
      };
    }
  );

  // --- Previews ---

  server.tool(
    "list_previews",
    "List app previews within a preview set.",
    {
      set_id: z.string().describe("The app preview set ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ set_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appPreviewSets/${set_id}/appPreviews`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_preview",
    "Create a new app preview (initiates upload). After creation, use the upload operations from the response to upload the video data.",
    {
      set_id: z.string().describe("The app preview set ID"),
      fileName: z.string().describe("The file name of the preview video"),
      fileSize: z.number().describe("The file size in bytes"),
      previewFrameTimeCode: z
        .string()
        .optional()
        .describe(
          "The time code for the preview frame image (e.g., 00:00:05;00)"
        ),
    },
    async ({ set_id, fileName, fileSize, previewFrameTimeCode }) => {
      const attributes: Record<string, unknown> = {
        fileName,
        fileSize,
      };
      if (previewFrameTimeCode !== undefined)
        attributes.previewFrameTimeCode = previewFrameTimeCode;

      const body = {
        data: {
          type: "appPreviews",
          attributes,
          relationships: {
            appPreviewSet: {
              data: {
                type: "appPreviewSets",
                id: set_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appPreviews",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_preview",
    "Delete an app preview.",
    {
      id: z.string().describe("The app preview ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appPreviews/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted preview ${id}`,
            }),
          },
        ],
      };
    }
  );
}

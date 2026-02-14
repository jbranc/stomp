import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";

export function registerAppEventTools(server: McpServer) {
  server.tool(
    "list_app_events",
    "List in-app events for an app.",
    {
      app_id: z.string().describe("The App Store Connect app ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ app_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/apps/${app_id}/appEvents`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_app_event",
    "Create a new in-app event for an app.",
    {
      app_id: z.string().describe("The App Store Connect app ID"),
      referenceName: z.string().describe("A reference name for the event"),
      badge: z
        .enum([
          "LIVE_EVENT",
          "PREMIERE",
          "CHALLENGE",
          "COMPETITION",
          "NEW_SEASON",
          "MAJOR_UPDATE",
          "SPECIAL_EVENT",
        ])
        .describe("The badge type for the event"),
      deepLink: z.string().optional().describe("Deep link URL for the event"),
      purchaseRequirement: z
        .enum([
          "NO_COST_ASSOCIATED",
          "IN_APP_PURCHASE",
          "SUBSCRIPTION",
          "IN_APP_PURCHASE_AND_SUBSCRIPTION",
          "IN_APP_PURCHASE_OR_SUBSCRIPTION",
        ])
        .optional()
        .describe("Purchase requirement for the event"),
      primaryLocale: z
        .string()
        .optional()
        .describe("Primary locale for the event (e.g., en-US)"),
      priority: z
        .enum(["HIGH", "NORMAL"])
        .optional()
        .describe("Priority of the event"),
      purpose: z
        .enum([
          "APPROPRIATE_FOR_ALL_USERS",
          "ATTRACT_NEW_USERS",
          "KEEP_ACTIVE_USERS_INFORMED",
          "BRING_BACK_LAPSED_USERS",
        ])
        .optional()
        .describe("Target audience purpose for the event"),
      territorySchedules: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("Array of territory schedule objects with publishStart, eventStart, eventEnd"),
    },
    async ({
      app_id,
      referenceName,
      badge,
      deepLink,
      purchaseRequirement,
      primaryLocale,
      priority,
      purpose,
      territorySchedules,
    }) => {
      const attributes: Record<string, unknown> = {
        referenceName,
        badge,
      };
      if (deepLink !== undefined) attributes.deepLink = deepLink;
      if (purchaseRequirement !== undefined)
        attributes.purchaseRequirement = purchaseRequirement;
      if (primaryLocale !== undefined) attributes.primaryLocale = primaryLocale;
      if (priority !== undefined) attributes.priority = priority;
      if (purpose !== undefined) attributes.purpose = purpose;
      if (territorySchedules !== undefined)
        attributes.territorySchedules = territorySchedules;

      const body = {
        data: {
          type: "appEvents",
          attributes,
          relationships: {
            app: {
              data: {
                type: "apps",
                id: app_id,
              },
            },
          },
        },
      };

      const response = await apiRequest("POST", "/v1/appEvents", body);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "update_app_event",
    "Update an existing in-app event.",
    {
      id: z.string().describe("The app event ID"),
      referenceName: z.string().optional().describe("Updated reference name"),
      badge: z
        .enum([
          "LIVE_EVENT",
          "PREMIERE",
          "CHALLENGE",
          "COMPETITION",
          "NEW_SEASON",
          "MAJOR_UPDATE",
          "SPECIAL_EVENT",
        ])
        .optional()
        .describe("Updated badge type"),
      deepLink: z.string().optional().describe("Updated deep link URL"),
      purchaseRequirement: z
        .enum([
          "NO_COST_ASSOCIATED",
          "IN_APP_PURCHASE",
          "SUBSCRIPTION",
          "IN_APP_PURCHASE_AND_SUBSCRIPTION",
          "IN_APP_PURCHASE_OR_SUBSCRIPTION",
        ])
        .optional()
        .describe("Updated purchase requirement"),
      primaryLocale: z.string().optional().describe("Updated primary locale"),
      priority: z.enum(["HIGH", "NORMAL"]).optional().describe("Updated priority"),
      purpose: z
        .enum([
          "APPROPRIATE_FOR_ALL_USERS",
          "ATTRACT_NEW_USERS",
          "KEEP_ACTIVE_USERS_INFORMED",
          "BRING_BACK_LAPSED_USERS",
        ])
        .optional()
        .describe("Updated purpose"),
      territorySchedules: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("Updated territory schedule objects"),
    },
    async ({
      id,
      referenceName,
      badge,
      deepLink,
      purchaseRequirement,
      primaryLocale,
      priority,
      purpose,
      territorySchedules,
    }) => {
      const attributes: Record<string, unknown> = {};
      if (referenceName !== undefined) attributes.referenceName = referenceName;
      if (badge !== undefined) attributes.badge = badge;
      if (deepLink !== undefined) attributes.deepLink = deepLink;
      if (purchaseRequirement !== undefined)
        attributes.purchaseRequirement = purchaseRequirement;
      if (primaryLocale !== undefined) attributes.primaryLocale = primaryLocale;
      if (priority !== undefined) attributes.priority = priority;
      if (purpose !== undefined) attributes.purpose = purpose;
      if (territorySchedules !== undefined)
        attributes.territorySchedules = territorySchedules;

      const body = {
        data: {
          type: "appEvents",
          id,
          attributes,
        },
      };

      const response = await apiRequest("PATCH", `/v1/appEvents/${id}`, body);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_app_event",
    "Delete an in-app event.",
    {
      id: z.string().describe("The app event ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appEvents/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted app event ${id}`,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "list_app_event_localizations",
    "List localizations for an in-app event.",
    {
      event_id: z.string().describe("The app event ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ event_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/appEvents/${event_id}/localizations`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "create_app_event_localization",
    "Create a localization for an in-app event.",
    {
      event_id: z.string().describe("The app event ID"),
      locale: z.string().describe("The locale code (e.g., en-US, fr-FR)"),
      name: z.string().describe("Localized name of the event"),
      shortDescription: z
        .string()
        .optional()
        .describe("Localized short description"),
      longDescription: z
        .string()
        .optional()
        .describe("Localized long description"),
    },
    async ({ event_id, locale, name, shortDescription, longDescription }) => {
      const attributes: Record<string, unknown> = { locale, name };
      if (shortDescription !== undefined)
        attributes.shortDescription = shortDescription;
      if (longDescription !== undefined)
        attributes.longDescription = longDescription;

      const body = {
        data: {
          type: "appEventLocalizations",
          attributes,
          relationships: {
            appEvent: {
              data: {
                type: "appEvents",
                id: event_id,
              },
            },
          },
        },
      };

      const response = await apiRequest(
        "POST",
        "/v1/appEventLocalizations",
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "update_app_event_localization",
    "Update a localization for an in-app event.",
    {
      id: z.string().describe("The app event localization ID"),
      name: z.string().optional().describe("Updated localized name"),
      shortDescription: z
        .string()
        .optional()
        .describe("Updated localized short description"),
      longDescription: z
        .string()
        .optional()
        .describe("Updated localized long description"),
    },
    async ({ id, name, shortDescription, longDescription }) => {
      const attributes: Record<string, unknown> = {};
      if (name !== undefined) attributes.name = name;
      if (shortDescription !== undefined)
        attributes.shortDescription = shortDescription;
      if (longDescription !== undefined)
        attributes.longDescription = longDescription;

      const body = {
        data: {
          type: "appEventLocalizations",
          id,
          attributes,
        },
      };

      const response = await apiRequest(
        "PATCH",
        `/v1/appEventLocalizations/${id}`,
        body
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_app_event_localization",
    "Delete a localization for an in-app event.",
    {
      id: z.string().describe("The app event localization ID to delete"),
    },
    async ({ id }) => {
      await apiRequest("DELETE", `/v1/appEventLocalizations/${id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              message: `Deleted app event localization ${id}`,
            }),
          },
        ],
      };
    }
  );
}

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "../client.js";

export function registerXcodeCloudTools(server: McpServer) {
  server.tool(
    "list_ci_products",
    "List Xcode Cloud CI products, optionally filtered by product type.",
    {
      filter_productType: z
        .enum(["APP", "FRAMEWORK"])
        .optional()
        .describe("Filter by product type (APP or FRAMEWORK)"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ filter_productType, limit }) => {
      const params: Record<string, string> = {
        include: "app,bundleId,primaryRepositories",
      };
      if (filter_productType) params["filter[productType]"] = filter_productType;
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        "/v1/ciProducts",
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_ci_product",
    "Get details of a specific Xcode Cloud CI product.",
    {
      id: z.string().describe("The CI product ID"),
    },
    async ({ id }) => {
      const params: Record<string, string> = {
        include: "app,bundleId,primaryRepositories",
      };

      const response = await apiRequest(
        "GET",
        `/v1/ciProducts/${id}`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_workflows",
    "List Xcode Cloud workflows for a CI product.",
    {
      product_id: z.string().describe("The CI product ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ product_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciProducts/${product_id}/workflows`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_ci_workflow",
    "Get details of a specific Xcode Cloud workflow.",
    {
      id: z.string().describe("The CI workflow ID"),
    },
    async ({ id }) => {
      const response = await apiRequest(
        "GET",
        `/v1/ciWorkflows/${id}`
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_build_runs",
    "List Xcode Cloud build runs for a workflow, sorted by most recent.",
    {
      workflow_id: z.string().describe("The CI workflow ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ workflow_id, limit }) => {
      const params: Record<string, string> = {
        sort: "-startedDate",
      };
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciWorkflows/${workflow_id}/buildRuns`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_ci_build_run",
    "Get details of a specific Xcode Cloud build run.",
    {
      id: z.string().describe("The CI build run ID"),
    },
    async ({ id }) => {
      const params: Record<string, string> = {
        include: "builds,workflow,sourceBranchOrTag,destinationBranch",
      };

      const response = await apiRequest(
        "GET",
        `/v1/ciBuildRuns/${id}`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "start_ci_build_run",
    "Start a new Xcode Cloud build run for a workflow.",
    {
      workflow_id: z.string().describe("The CI workflow ID to run"),
      sourceBranchOrTag_id: z
        .string()
        .describe("The ID of the source branch or tag to build from"),
    },
    async ({ workflow_id, sourceBranchOrTag_id }) => {
      const body = {
        data: {
          type: "ciBuildRuns",
          relationships: {
            workflow: {
              data: {
                type: "ciWorkflows",
                id: workflow_id,
              },
            },
            sourceBranchOrTag: {
              data: {
                type: "scmGitReferences",
                id: sourceBranchOrTag_id,
              },
            },
          },
        },
      };

      const response = await apiRequest("POST", "/v1/ciBuildRuns", body);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_build_actions",
    "List build actions for an Xcode Cloud build run.",
    {
      run_id: z.string().describe("The CI build run ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ run_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciBuildRuns/${run_id}/actions`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_artifacts",
    "List artifacts for an Xcode Cloud build action.",
    {
      action_id: z.string().describe("The CI build action ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ action_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciBuildActions/${action_id}/artifacts`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_test_results",
    "List test results for an Xcode Cloud build action.",
    {
      action_id: z.string().describe("The CI build action ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ action_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciBuildActions/${action_id}/testResults`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_issues",
    "List issues for an Xcode Cloud build action.",
    {
      action_id: z.string().describe("The CI build action ID"),
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ action_id, limit }) => {
      const params: Record<string, string> = {};
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        `/v1/ciBuildActions/${action_id}/issues`,
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_mac_os_versions",
    "List available macOS versions for Xcode Cloud, including Xcode versions.",
    {
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ limit }) => {
      const params: Record<string, string> = {
        include: "xcodeVersions",
      };
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        "/v1/ciMacOsVersions",
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "list_ci_xcode_versions",
    "List available Xcode versions for Xcode Cloud, including macOS versions.",
    {
      limit: z.number().min(1).max(200).optional(),
    },
    async ({ limit }) => {
      const params: Record<string, string> = {
        include: "macOsVersions",
      };
      if (limit) params["limit"] = String(limit);

      const response = await apiRequest(
        "GET",
        "/v1/ciXcodeVersions",
        undefined,
        params
      );

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }],
      };
    }
  );
}

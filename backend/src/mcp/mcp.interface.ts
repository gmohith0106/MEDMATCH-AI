/**
 * Model Context Protocol (MCP) Specification Interfaces for MedMatch AI
 * Specification: JSON-RPC 2.0 / MCP v2024-11-05
 */

export interface McpServerInfo {
  name: string;
  version: string;
  description: string;
}

export interface McpToolParameterSchema {
  type: string;
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
  }>;
  required?: string[];
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: McpToolParameterSchema;
}

export interface McpResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
}

export interface McpJsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: Record<string, any>;
}

export interface McpJsonRpcResponse {
  jsonrpc: '2.0';
  id?: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

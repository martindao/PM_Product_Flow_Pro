export interface MCPServerConfig {
  name: string;
  version: string;
  capabilities: {
    resources: boolean;
    tools: boolean;
  };
  env: {
    ANTHROPIC_API_KEY: string;
    MODEL: string;
    MAX_TOKENS: number;
    TEMPERATURE: number;
    DEBUG?: boolean;
  };
}

export interface MCPToolConfig {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  required: string[];
}

export interface MCPTransportConfig {
  timeout?: number;
  retries?: number;
  debug?: boolean;
}
# [2025-01-21] (Workflow) schedule note: Improve Task Master export for Workflow

# [2025-02-05] (Expert) schedule note: Document expert workflow for Expert

# [2025-03-07] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-04-17] (OpenRouter) schedule note: Harden OpenRouter integration for OpenRouter

# [2025-06-03] (Expert) schedule note: Harden OpenRouter integration for Expert

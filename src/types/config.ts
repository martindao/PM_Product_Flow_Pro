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
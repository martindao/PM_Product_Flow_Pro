declare module '@modelcontextprotocol/sdk/dist/cjs/server/mcp.js' {
  export class McpServer {
    constructor(serverInfo: any);
    tool(name: string, config: any, handler?: any): void;
    connect(transport: any): Promise<void>;
    server: any;
  }

  export class StdioServerTransport {
    constructor();
  }
}

declare module '@modelcontextprotocol/sdk/dist/cjs/server/stdio.js' {
  export class StdioServerTransport {
    constructor();
  }
}

declare module '@anthropic-ai/sdk' {
  export default class Anthropic {
    constructor(config: { apiKey: string });
    messages: {
      create(params: any): Promise<{
        content: Array<{
          text?: string;
          [key: string]: any;
        }>;
      }>;
    };
  }
}

# [2025-02-06] (Workflow) schedule note: Refine MCP prompt flow for Workflow

# [2025-04-17] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-06-04] (OpenRouter) schedule note: Document expert workflow for OpenRouter

# [2025-07-15] (Workflow) schedule note: Document expert workflow for Workflow

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

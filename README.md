# Product Flow Pro

A sophisticated product management workflow automation platform with MCP (Model Context Protocol) integration.

## Features
- **OpenRouter Integration**: Seamless connection with OpenRouter AI models for enhanced product analysis
- **MCP Protocol Support**: Full Model Context Protocol implementation for extensible integrations
- **Expert Workflows**: Intelligent workflow automation for product expert processes
- **Task Master Export**: Advanced export capabilities for project management integration
- **Prompt Flow Refinement**: Dynamic prompt optimization and management
- **Expert Documentation**: Comprehensive documentation generation for expert workflows

## Core Components

- **MCP Integration**: Core MCP protocol implementation
- **OpenRouter Service**: AI model integration layer
- **Workflow Engine**: Expert workflow automation
- **Prompt Manager**: Dynamic prompt optimization
- **Export System**: Task Master and other platform integrations

## Architecture

```
src/
├── core/          # Core MCP implementation
├── openrouter/    # OpenRouter integration
├── workflows/     # Expert workflow definitions
├── prompts/       # Prompt management system
├── export/        # Export and integration modules
└── utils/         # Utility functions
```

## Usage

Run the MCP server:
```bash
npm run start:mcp
```

Start the OpenRouter integration:
```bash
npm run start:openrouter
```

Execute workflow automation:
```bash
npm run automate:workflows
```

## Configuration

Update configuration in `.env`:
```
OPENROUTER_API_KEY=your_api_key
MCP_SERVER_PORT=3000
TASK_MASTER_ENDPOINT=https://api.taskmaster.com
```

## Dependencies

- @modelcontextprotocol/sdk
- openai
- typescript
- node-cron
- express

## Development

```bash
npm install
npm run build
npm run test
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

- [2024-12-31] (MCP) schedule note: Refine MCP prompt flow for MCP

- [2025-02-18] (MCP) schedule note: Harden OpenRouter integration for MCP

- [2025-04-01] (OpenRouter) schedule note: Improve Task Master export for OpenRouter

- [2025-05-12] (OpenRouter) schedule note: Improve Task Master export for OpenRouter

- [2025-06-26] (Expert) schedule note: Harden OpenRouter integration for Expert

- [2025-08-07] (OpenRouter) schedule note: Document expert workflow for OpenRouter

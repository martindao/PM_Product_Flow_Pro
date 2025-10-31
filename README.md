# Product Flow Pro (MCP)

## Overview
Product Flow Pro stitches together expert-driven MCP servers, Task Master orchestration, and OpenRouter-backed workflows. It is implemented in Node.js/TypeScript and ships CLI helpers for generating PRDs, workflows, and Task Master configurations.

## Repository Layout
- src/ – TypeScript sources (experts/, handlers/, shared utilities).
- docs/ – architecture notes, prompt libraries, Task Master integration steps.
- 	emplates/ – blueprint prompts for PRDs, reviews, and MCP skills.
- scripts/ – Node helpers that produce PRDs or Task Master bundles.
- 	ests/ – Jest suites exercising handlers and expert flows.
- .cursor/, 	est-install/ – automation helpers and smoke-test scaffolding.

## Environment Setup
1. Install dependencies:
   `powershell
   npm install
   `
2. Configure environment variables:
   `powershell
   copy .env.example .env
   # Set OPENROUTER_API_KEY, TASK_MASTER_URL, MCP_WS_URL, etc.
   `
3. (Optional) authenticate with Task Master following docs/task-master-integration.md.

## Running Workflows
- Local dev server:
  `powershell
  npm run dev
  `
- Production build:
  `powershell
  npm run build
  npm run start
  `
- CLI helpers:
  `powershell
  node scripts/generate-prd.js --project "Next-gen roadmap"
  node scripts/create-task-master-files.js --output ./tmp/task-master
  `

## Quality & Automation
- Lint and format before pushing changes:
  `powershell
  npm run lint
  npm run format
  `
- Run Jest suites:
  `powershell
  npm test
  `
- Keep mcp-config.json in sync with any new experts or Task Master endpoints.
- Ensure deployment platforms (Render, Vercel, pm2, etc.) load the same .env values described in docs/task-master-integration.md.

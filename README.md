# Product Flow Pro (MCP)

## Overview
Product Flow Pro is a Model Context Protocol implementation that stitches expert-driven MCP servers, Task Master orchestration, and OpenRouter-backed workflows into a single toolkit for PM/UX/Eng collaboration. It deploys as a Node.js service with TypeScript sources and ships CLI helpers for generating PRDs, workflows, and Task Master configs.

## Repository Layout
- src/ – TypeScript sources (experts/, handlers/, shared utilities).
- docs/ – architecture notes, prompt libraries, Task Master integration steps.
- 	emplates/ – blueprint prompts for PRDs, reviews, and MCP skills.
- scripts/ – Node helpers that create PRDs or Task Master bundles.
- 	ests/ – Jest suites exercising handlers and expert flows.
- .cursor/, 	est-install/ – environment automation and smoke-test scaffolding.

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
3. (Optional) log into Task Master per docs/task-master-integration.md if you plan to exercise end-to-end workflows.

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
- Lint and format before committing:
  `powershell
  npm run lint
  npm run format
  `
- Execute Jest suites:
  `powershell
  npm test
  `
- Keep mcp-config.json in sync with any new experts or Task Master endpoints.
- Deployment targets (Render/Vercel/pm2) should inject the same .env variables used locally; see docs/task-master-integration.md for the full list.

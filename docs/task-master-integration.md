# Optional Integration with Task Master AI

This guide explains how to use AI Expert Workflow MCP alongside Task Master AI (optional).

> **Note**: Task Master integration is completely optional. AI Expert Workflow can be used on its own to generate comprehensive PRDs without Task Master.

## Configuration

To use both MCPs together, add both to your editor configuration:

```json
{
  "mcpServers": {
    "ai-expert-workflow": {
      "command": "npx",
      "args": ["-y", "ai-expert-workflow-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "YOUR_OPENROUTER_API_KEY_HERE",
        "OPENROUTER_MODEL": "tngtech/deepseek-r1t-chimera:free",
        "MAX_TOKENS": 4000,
        "TEMPERATURE": 0.7
      }
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY_HERE",
        "MODEL": "claude-3-sonnet-20240229",
        "PERPLEXITY_MODEL": "sonar-pro",
        "MAX_TOKENS": 64000,
        "TEMPERATURE": 0.2,
        "DEFAULT_SUBTASKS": 5,
        "DEFAULT_PRIORITY": "medium"
      }
    }
  }
}
```

### Model Options

**For AI Expert Workflow (using OpenRouter API):**
With OpenRouter API, you can choose from various AI models based on your needs:

- **High-performance models** for complex planning:
  - `openai/gpt-4o`
  - `anthropic/claude-3-opus-20240229`
  - `meta/llama-3-70b-instruct`

- **Balanced models** for everyday work:
  - `anthropic/claude-3-sonnet-20240229`
  - `mistral/mistral-large`
  - `google/gemini-pro`

- **Fast models** for quick iterations:
  - `openai/gpt-3.5-turbo`
  - `anthropic/claude-3-haiku-20240307`
  - `mistral/mistral-medium`

For the full list of available models, see [OpenRouter Models](https://openrouter.ai/models).

**For Task Master AI (using Anthropic API):**
Task Master AI currently supports Anthropic Claude models:
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229` (recommended)
- `claude-3-haiku-20240307`

Task Master AI also supports Perplexity API models (optional, for enhanced research):
- `sonar-small-online`
- `sonar-medium-online`
- `sonar-pro` (recommended)

## Enhanced Workflow: The Three Spheres Method

AI Expert Workflow now implements the "Méthode des Trois Sphères" (Three Spheres Method), a methodical approach that transforms ideas into functional products through three distinct phases. Each expert builds upon the work of the previous one:

1. **Sphere 1: Product Definition & Architectural Foundation** (AI Product Manager)
   - Establishes the solid foundation for the entire project
   - Defines the product vision, user personas, business requirements, and key features

2. **Sphere 2: UX Design & Feature Expansion** (AI UX Designer)
   - Uses the Product Manager's document as input
   - Develops the user experience and expands on each feature

3. **Sphere 3: Technical Planning & Implementation Specifications** (AI Software Architect)
   - Uses both the Product Manager's and UX Designer's documents as input
   - Transforms the vision into a concrete technical plan

This progressive development process ensures comprehensive coverage of all important aspects of your product, from initial concept to technical implementation.

### Step 1: Generate Your PRD with AI Expert Workflow (Required)

1. Start the AI Expert Workflow:
   ```
   Can you start the AI Expert Workflow for my project?
   ```

2. The workflow will guide you through three stages:
   - **Product Definition** with the AI Product Manager
   - **UX Design** with the AI UX Designer
   - **Technical Architecture** with the AI Software Architect

3. Each stage has specific topics that must be covered:
   - For Product Manager: product vision, user personas, business requirements, etc.
   - For UX Designer: UI documentation, feature specifications, user journeys, etc.
   - For Software Architect: technical architecture, API specifications, implementation tasks, etc.

4. The system tracks your progress and ensures all topics are covered before moving to the next stage.

5. When you're ready to move to the next stage:
   ```
   Let's move to the next stage
   ```

6. Generate documents at any point:
   ```
   Can you generate a complete PRD document based on our consultation?
   ```

7. Review your PRD in `PRD.md` and the continuously updated `scripts/prd.txt`

At this point, you have a complete PRD that you can use for your development planning. You can stop here if you don't need task management.

### Step 2: Use Task Master to Generate Tasks (Optional)

If you want to break down your PRD into development tasks:

1. Use Task Master to parse the PRD and generate tasks:
   ```
   Can you parse the PRD at scripts/prd.txt and generate tasks?
   ```

   **Important**: The `scripts/prd.txt` file is continuously improved throughout the workflow. While you can use it with Task Master at any point, it's most valuable after all three expert phases are complete, as it will then contain a comprehensive specification with input from all three experts.

2. Use Task Master to work on the generated tasks:
   ```
   What's the next task I should work on?
   Can you help me implement task 3?
   ```

For more details on the enhanced workflow, see [Enhanced Workflow Documentation](enhanced-workflow.md).

## Full Workflow Example

### Enhanced AI Expert Workflow

#### 1. Start the Complete Workflow

User: "Can you start the AI Expert Workflow for my task management app for developers?"

AI Expert Workflow: [Introduces the three-stage process and begins with the Product Manager]

#### 2. Product Definition Stage

AI Product Manager: "Let's start by discussing your product vision. What problem is your task management app trying to solve?"

User: "Developers often struggle to track tasks across multiple projects and repositories."

AI Product Manager: "Great, now let's talk about your target users. Who specifically will be using this app?"

User: [Provides details about target users]

AI Product Manager: "Now that we've covered product vision and user personas, let's discuss business requirements..."

[Conversation continues through all required topics]

User: "I think we've covered everything for the product definition. Let's move to the next stage."

AI Expert Workflow: [Checks if all topics are covered, then transitions to UX Design stage]

#### 3. UX Design Stage

AI UX Designer: "Based on the product definition, let's design the user experience. First, let's discuss UI documentation and design preferences..."

[Conversation continues through all UX topics]

User: "Let's move to the technical planning stage."

AI Expert Workflow: [Transitions to Software Architecture stage]

#### 4. Technical Planning Stage

AI Software Architect: "Now let's plan the technical implementation. What technology stack are you considering for this app?"

[Conversation continues through all technical topics]

User: "I think we've covered everything. Can you generate the comprehensive document?"

AI Expert Workflow: [Generates a comprehensive document combining all three stages and saves it]

**At this point, you have a complete project specification that you can use for development planning.**

### Optional: Use Task Master for Task Management

If you want to break down your PRD into development tasks:

#### 5. Generate Tasks with Task Master (Optional)

User: "Can you parse the PRD at scripts/prd.txt and generate tasks?"

Task Master: [Analyzes the PRD and creates tasks]

#### 6. Work on Tasks with Task Master (Optional)

User: "What's the next task I should work on?"

Task Master: [Recommends the next task based on priority]

User: "Can you help me implement task 3?"

Task Master: [Provides guidance on implementing the specific task]

## Tips for Efficient Workflow

### For Enhanced AI Expert Workflow

1. **Follow the guided process** to ensure comprehensive coverage of all topics
2. **Provide detailed responses** to the expert's questions for better results
3. **Use the topic tracking feature** to ensure nothing important is missed
4. **Move between stages** only when you've covered all required topics
5. **Review progress** by asking what topics have been covered and what remains

### For Standalone PRD Generation

1. **Complete the consultation process** before generating documents
2. **Review generated PRDs** carefully before using them for development planning
3. **Save your PRDs** in a version control system for future reference
4. **Iterate as needed** with the AI Product Manager to refine your PRD

### For Optional Task Master Integration

1. **Review generated documents** before using them with Task Master
2. **Be specific about file paths** when asking Task Master to parse documents
3. **Use Task Master's task tracking** to manage your implementation progress
4. **Remember that Task Master is optional** - you can use AI Expert Workflow on its own
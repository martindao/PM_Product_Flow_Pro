# OpenRouter for AI Expert Workflow

This project uses [OpenRouter](https://openrouter.ai/) as its AI provider, which allows you to access various AI models through a unified API.

## Setup

1. Sign up for an account at [OpenRouter](https://openrouter.ai/)
2. Create an API key at [https://openrouter.ai/keys](https://openrouter.ai/keys)
3. Add your API key to the `.env` file:

```
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=tngtech/deepseek-r1t-chimera:free
```

This project uses the `tngtech/deepseek-r1t-chimera:free` model by default, which provides good performance while being cost-effective. You can change the model to any model supported by OpenRouter. See the [list of available models](https://openrouter.ai/models).

## Using OpenRouter in Your Code

The project uses OpenRouter for all AI capabilities through the `aiUtils.ts` module:

```typescript
import { consultWithExpert, generateExpertDocument } from './utils/aiUtils';

// Use the functions to interact with AI models via OpenRouter
const response = await consultWithExpert('productManager', 'My project description');
```

## Testing OpenRouter Integration

The project includes comprehensive tests for the OpenRouter integration:

```bash
# Quick verification of OpenRouter API (recommended)
npm run test:openrouter-direct

# Verify your API key without modifying the .env file
npm run verify-openrouter YOUR_API_KEY

# Run essential tests (tests both MCP and OpenRouter)
npm run test:essential

# Run comprehensive tests
npm run test:all

# Run individual test components
npm test                    # JavaScript tests
npm run test:ts             # TypeScript tests
./tests/run-js-test.sh      # JavaScript tests via shell script
./tests/run-ts-test.sh      # TypeScript tests via shell script
```

Test results will be saved to `tests/results/result_test.md` and `tests/results/result_test_ts.md`. These files contain detailed information about the API requests and responses, making it easy to debug and understand how the OpenRouter API works.

These tests verify:
1. Consulting with all three experts (Product Manager, UX Designer, Software Architect)
2. Generating documents for each expert
3. Error handling for invalid inputs

## Benefits of Using OpenRouter

1. **Access to multiple models**: OpenRouter provides access to various AI models from different providers.
2. **Fallback options**: If one model is unavailable, OpenRouter can automatically route to another model.
3. **Unified API**: Use the same API for different models.
4. **Cost optimization**: OpenRouter can help optimize costs by routing to the most cost-effective model.

## Available Models

OpenRouter supports dozens of models from multiple providers. Here's a guide to help you choose the right model for your use case:

### For Complex Planning and Strategy Tasks

These powerful models excel at product planning, architectural design, and UX strategy:

- `anthropic/claude-3-opus-20240229` - Claude's most powerful model, excellent for detailed PRDs
- `openai/gpt-4o` - OpenAI's most capable model, especially good at reasoning
- `meta/llama-3-70b-instruct` - Meta's largest open model, very capable for planning

### For Balanced Performance

Great everyday models that balance capability with efficiency:

- `anthropic/claude-3-sonnet-20240229` - Claude's mid-tier model, good all-around choice
- `mistral/mistral-large` - Excellent performance-to-cost ratio
- `google/gemini-pro` - Google's flagship model, strong at a variety of tasks

### For Quick Iterations and Testing

Fast, cost-effective models for rapid development:

- `anthropic/claude-3-haiku-20240307` - Claude's fastest model
- `openai/gpt-3.5-turbo` - Very fast responses, good for simple tasks
- `mistral/mistral-medium` - Good middle ground for speed and capability

### Specialized Models

- `perplexity/sonar-medium-online` - Internet-connected model, good for research
- `cohere/command-r` - Excellent for document analysis
- `deepseek/deepseek-coder` - Specialized for code generation

You can set the model via the `MODEL` environment variable or in your `.env` file as `OPENROUTER_MODEL`.

For the complete, up-to-date list with pricing information, see [https://openrouter.ai/models](https://openrouter.ai/models).

## API Reference

For more information about the OpenRouter API, see the [API Reference](https://openrouter.ai/docs/api-reference/overview).

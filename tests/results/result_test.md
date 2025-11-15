# OpenRouter API Test Results

## Request
- Model: tngtech/deepseek-r1t-chimera:free
- Max Tokens: 4000
- Temperature: 0.7
- Query: "Say 'OpenRouter API is working correctly with the deepseek-r1t-chimera model!' if you can read this message."

## Response


## API Response Details
```json
{
  "id": "gen-1745846970-AxLMXjpSgB1BFjRxnz9C",
  "provider": "Chutes",
  "model": "tngtech/deepseek-r1t-chimera:free",
  "object": "chat.completion",
  "created": 1745846970,
  "choices": [
    {
      "logprobs": null,
      "finish_reason": "stop",
      "native_finish_reason": "stop",
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "",
        "refusal": null,
        "reasoning": "OpenRouter API is working correctly with the deepseek-r1t-chimera model!\\n"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 39,
    "completion_tokens": 20,
    "total_tokens": 59
  }
}
```

# Unified AI Router Documentation

A streamlined AI routing system that automatically detects whether to use **Mistral** (general chat/reasoning) or **Codestral** (code generation) based on your prompt content.

## 🚀 Features

- **Auto-Detection**: Intelligently routes prompts to the appropriate AI service
- **Dual Fallback**: If the primary provider fails, automatically falls back to the secondary
- **Explicit Control**: Direct methods to force specific providers when needed
- **Rich Logging**: Clear console output showing routing decisions and responses
- **Code Completion**: Specialized support for fill-in-the-middle (FIM) code completion

## 📦 Installation & Setup

### Environment Variables

Add these to your `.env.local` and Vercel environment variables:

```env
# Mistral Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_API_BASE_URL=https://api.mistral.ai/v1

# Codestral Configuration
CODESTRAL_API_KEY=vzNn973kVxLJMmla9DlMxmtzFrWyr8tJ
CODESTRAL_API_BASE_URL=https://codestral.mistral.ai/v1
```

### Import the Router

```typescript
import { runAI, runCodestral, runMistral } from '~/lib/ai';
```

## 🎯 Usage Examples

### 1. Auto-Detection (Recommended)

Let the router decide which AI to use based on your prompt:

```typescript
// General chat → Routed to Mistral
const chatResult = await runAI("Explain quantum computing simply");
console.log(chatResult.content); // AI explanation
console.log(chatResult.provider); // 'mistral'

// Code generation → Routed to Codestral  
const codeResult = await runAI("Write a React hook for API calls");
console.log(codeResult.content); // Generated React code
console.log(chatResult.provider); // 'codestral'
```

**Keywords that trigger Codestral:**
- `function`, `class`, `import`, `export`, `console.log`
- `typescript`, `javascript`, `python`, `react`, `component`
- `write code`, `generate code`, `implement`, `algorithm`
- `api`, `endpoint`, `sql`, `graphql`, `rest`, `axios`

### 2. Explicit Provider Selection

Force specific providers when you need precise control:

```typescript
// Force Codestral for code tasks
const codeResult = await runCodestral(
  "Create a TypeScript interface for a user object",
  { temperature: 0.3, maxTokens: 1024 }
);

// Force Mistral for complex reasoning
const reasoningResult = await runMistral(
  "Analyze the trade-offs between microservices and monolithic architecture",
  { temperature: 0.5, maxTokens: 1500 }
);
```

### 3. Code Completion (Fill-in-the-Middle)

Specialized for completing partial code snippets:

```typescript
const completion = await runCodestral(
  "function calculateFactorial(n) {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(",
  { 
    endpoint: 'fim',           // Fill-in-the-middle
    temperature: 0.1,          // Low temperature for precise completion
    maxTokens: 512 
  }
);
```

### 4. Configuration Options

Customize responses with additional parameters:

```typescript
const result = await runAI(
  "Write a creative function name generator",
  {
    model: "mistral-large-latest",  // Use specific model
    temperature: 0.9,               // Higher creativity (0.0-1.0)
    maxTokens: 1000                 // Limit response length
  }
);
```

## 🛡️ Error Handling & Fallback

The router includes automatic fallback mechanisms:

1. **Code Requests**: If Codestral fails → Fallback to Mistral
2. **Chat Requests**: If Mistral fails → Fallback to Codestral
3. **Both Fail**: Comprehensive error with details

```typescript
try {
  const result = await runAI("Complex algorithm implementation");
  // Success: returns { content, provider, usage }
} catch (error) {
  console.error('Both providers failed:', error);
  // Handle gracefully in your application
}
```

## 📊 Response Format

All methods return a consistent response object:

```typescript
{
  content: string,          // AI-generated content
  provider: string,         // 'mistral', 'codestral', 'mistral-fallback', etc.
  usage: {                  // Token usage statistics
    prompt_tokens?: number,
    completion_tokens?: number,
    total_tokens?: number
  }
}
```

## 🔄 Migration from Old Router

If you're migrating from the old `ai-router.ts`:

**Old Way:**
```typescript
import AIRouter from '~/lib/ai-router';

const router = new AIRouter();
const result = await router.route({
  type: 'code',
  prompt: 'Write a function'
});
```

**New Way:**
```typescript
import { runAI } from '~/lib/ai';

const result = await runAI('Write a function');
// Auto-detects as code and routes to Codestral
```

## 🧪 Testing

Run the usage examples to test the router:

```typescript
import { runExamples } from '~/examples/ai-usage';

await runExamples();
```

## 🎨 Console Output

The router provides helpful logging:

```
[AI Router] 💬 Routing to Mistral for general chat
[AI Router] ✅ Mistral response received successfully

[AI Router] 🛠️ Routing to Codestral for code generation  
[AI Router] ✅ Codestral response received successfully

[AI Router] ❌ Codestral failed, falling back to Mistral
[AI Router] ✅ Mistral fallback response received
```

## ⚡ Performance Tips

1. **Use Auto-Detection**: Most efficient for mixed workloads
2. **Lower Temperature for Code**: Use `temperature: 0.1-0.3` for precise code generation
3. **Adjust Max Tokens**: Set appropriate limits based on your use case
4. **Monitor Fallbacks**: Check `provider` field to see if fallbacks occurred

## 🔧 Troubleshooting

### Environment Variables Missing
```
Error: MISTRAL_API_KEY is required
```
→ Ensure all environment variables are properly set in your deployment platform

### Provider-Specific Errors
```
Error: Codestral API error (401): Unauthorized
```
→ Check your API keys and ensure they have proper permissions

### Timeout Issues
→ Consider reducing `maxTokens` or implementing request timeouts

## 📝 Notes

- **Codestral**: Specialized for code generation, completion, and refactoring
- **Mistral**: Best for general chat, reasoning, analysis, and creative tasks
- **Auto-Detection**: Uses keyword matching for routing decisions
- **Fallback**: Ensures high availability even if one provider fails
- **Logging**: Built-in console logging for debugging and monitoring

This unified router provides the best of both AI services with intelligent routing and robust error handling! 🎉
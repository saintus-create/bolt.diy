// src/examples/ai-usage.ts - Usage examples for the unified AI router
import { runAI, runCodestral, runMistral } from '../lib/ai';

/**
 * Example 1: Auto-detection (recommended for most cases)
 */
async function autoDetectionExample() {
  console.log('=== Auto-Detection Examples ===');
  
  // This will be routed to Mistral (general chat)
  const chatResult = await runAI("Explain recursion in simple terms");
  console.log('Chat Result:', chatResult.content);
  console.log('Provider Used:', chatResult.provider);
  console.log('');
  
  // This will be routed to Codestral (code generation)
  const codeResult = await runAI("Write a TypeScript function to reverse a string");
  console.log('Code Result:', codeResult.content);
  console.log('Provider Used:', codeResult.provider);
  console.log('');
}

/**
 * Example 2: Explicit provider selection
 */
async function explicitProviderExample() {
  console.log('=== Explicit Provider Examples ===');
  
  // Force use of Codestral for code generation
  const codestralResult = await runCodestral(
    "Create a React component that displays a user profile",
    { temperature: 0.3, maxTokens: 1024 }
  );
  console.log('Codestral Result:', codestralResult.content);
  console.log('Provider Used:', codestralResult.provider);
  console.log('');
  
  // Force use of Mistral for complex reasoning
  const mistralResult = await runMistral(
    "Analyze the pros and cons of using TypeScript vs JavaScript for large applications",
    { temperature: 0.5, maxTokens: 1500 }
  );
  console.log('Mistral Result:', mistralResult.content);
  console.log('Provider Used:', mistralResult.provider);
  console.log('');
}

/**
 * Example 3: Code completion with Codestral
 */
async function codeCompletionExample() {
  console.log('=== Code Completion Examples ===');
  
  // Fill-in-the-middle completion
  const completionResult = await runCodestral(
    "function calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n-1) + calculateFibonacci(",
    { endpoint: 'fim', temperature: 0.1, maxTokens: 512 }
  );
  console.log('Completion Result:', completionResult.content);
  console.log('Provider Used:', completionResult.provider);
  console.log('');
}

/**
 * Example 4: Error handling and fallback
 */
async function errorHandlingExample() {
  console.log('=== Error Handling Examples ===');
  
  try {
    // This will demonstrate fallback if Codestral fails
    const result = await runAI("Write a complex algorithm for pathfinding");
    console.log('Result with Fallback:', result.content);
    console.log('Final Provider:', result.provider);
    console.log('');
  } catch (error) {
    console.error('Both providers failed:', error);
  }
}

/**
 * Example 5: Different models and configurations
 */
async function configurationExample() {
  console.log('=== Configuration Examples ===');
  
  // Use different models with custom parameters
  const creativeResult = await runAI(
    "Write a creative story about AI and humanity",
    { 
      model: "mistral-large-latest", 
      temperature: 0.9, 
      maxTokens: 1000 
    }
  );
  console.log('Creative Result:', creativeResult.content);
  console.log('Provider Used:', creativeResult.provider);
  console.log('');
  
  // Precise code generation
  const preciseResult = await runAI(
    "Implement a binary search algorithm in Python with type hints",
    { 
      model: "codestral-latest", 
      temperature: 0.1, 
      maxTokens: 800 
    }
  );
  console.log('Precise Code Result:', preciseResult.content);
  console.log('Provider Used:', preciseResult.provider);
  console.log('');
}

/**
 * Main function to run all examples
 */
async function runExamples() {
  try {
    await autoDetectionExample();
    await explicitProviderExample();
    await codeCompletionExample();
    await errorHandlingExample();
    await configurationExample();
    
    console.log('🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Export examples for use in other files
export {
  autoDetectionExample,
  explicitProviderExample,
  codeCompletionExample,
  errorHandlingExample,
  configurationExample,
  runExamples
};

// Uncomment the line below to run examples when this file is executed directly
// runExamples();
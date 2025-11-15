// app/routes/api.test.tsx - Test endpoint to verify Codestral integration
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { runAI, runCodestral } from "~/lib/ai";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("🧪 Test API endpoint - Loader");
    
    // Test basic AI routing
    const testPrompt = "Write a simple JavaScript function to add two numbers";
    const result = await runAI(testPrompt, { maxTokens: 200, temperature: 0.2 });
    
    return json({
      status: "success",
      message: "AI Router Test Complete",
      test: "Auto-detection routing",
      provider: result.provider,
      response: result.content.substring(0, 200) + "...",
      usage: result.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Test API Error:", error);
    return json({
      status: "error",
      message: "AI Router Test Failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string || "Write a Python function to calculate factorial";
    
    console.log("🧪 Test API endpoint - Action with custom prompt:", prompt);
    
    // Test explicit Codestral call
    const codestralResult = await runCodestral(prompt, { 
      temperature: 0.3, 
      maxTokens: 500,
      endpoint: 'fim'
    });
    
    return json({
      status: "success",
      message: "Explicit Codestral Test Complete",
      test: "Direct Codestral call",
      provider: codestralResult.provider,
      response: codestralResult.content,
      usage: codestralResult.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Test API Action Error:", error);
    return json({
      status: "error", 
      message: "Explicit Codestral Test Failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
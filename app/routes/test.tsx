// app/routes/test.tsx - Simple test page for AI integration
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { runAI, runCodestral } from "~/lib/ai";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ message: "AI Integration Test Page" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const prompt = formData.get("prompt") as string;
  const testType = formData.get("testType") as string;
  
  try {
    let result;
    
    if (testType === "codestral") {
      result = await runCodestral(prompt, { 
        temperature: 0.3, 
        maxTokens: 500,
        endpoint: 'fim'
      });
    } else {
      result = await runAI(prompt, { 
        temperature: 0.7, 
        maxTokens: 500 
      });
    }
    
    return json({
      success: true,
      result: result.content,
      provider: result.provider,
      usage: result.usage
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default function Test() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🧪 AI Integration Test</h1>
      <p>{loaderData.message}</p>
      
      <div style={{ marginTop: "2rem" }}>
        <h2>Test Auto-Detection Router</h2>
        <Form method="post">
          <textarea
            name="prompt"
            defaultValue="Write a simple function to calculate the sum of an array"
            rows={3}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <input type="hidden" name="testType" value="auto" />
          <button type="submit">Test Auto-Detection (runAI)</button>
        </Form>
      </div>
      
      <div style={{ marginTop: "2rem" }}>
        <h2>Test Direct Codestral</h2>
        <Form method="post">
          <textarea
            name="prompt"
            defaultValue="Create a React component for a user profile card"
            rows={3}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <input type="hidden" name="testType" value="codestral" />
          <button type="submit">Test Direct Codestral</button>
        </Form>
      </div>
      
      {actionData && (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: actionData.success ? "#d4edda" : "#f8d7da", border: "1px solid #c3e6cb" }}>
          <h3>Test Result</h3>
          {actionData.success ? (
            <div>
              <p><strong>Provider:</strong> {actionData.provider}</p>
              <p><strong>Response:</strong></p>
              <pre style={{ whiteSpace: "pre-wrap" }}>{actionData.result}</pre>
              {actionData.usage && (
                <p><strong>Usage:</strong> {JSON.stringify(actionData.usage)}</p>
              )}
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {actionData.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
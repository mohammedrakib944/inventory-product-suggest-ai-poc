import Groq from "groq-sdk";
import { Product, SalesHistory } from "./types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callLLM(
  prompt: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Always respond with valid JSON when requested.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        if (onChunk) {
          onChunk(content);
        }
      }
    }

    console.log("Full LLM response:", fullResponse);
    return fullResponse;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

function extractJSON(text: string): unknown {
  // Remove markdown code blocks if present
  const cleanText = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  // Try to find JSON array or object
  const arrayMatch = cleanText.match(/\[[\s\S]*\]/);
  const objectMatch = cleanText.match(/\{[\s\S]*\}/);

  // Prefer array match for our use case
  const jsonMatch = arrayMatch || objectMatch;

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse JSON from LLM response:", e);
      console.log("Attempting to clean and parse again...");

      // Try to clean common JSON issues
      try {
        const cleaned = jsonMatch[0]
          .replace(/,\s*([}\]])/g, "$1") // Remove trailing commas
          .replace(/(\w+):/g, '"$1":'); // Quote unquoted keys

        return JSON.parse(cleaned);
      } catch (e2) {
        console.error("Failed to parse cleaned JSON:", e2);
      }
    }
  }
  throw new Error("No valid JSON found in LLM response");
}

export async function getRestockSuggestions(
  inventory: Product[],
  salesHistory: SalesHistory[],
): Promise<unknown[]> {
  const prompt = `
You are an inventory management AI assistant. Analyze the following inventory data and suggest products that need restocking.

Inventory Data:
${JSON.stringify(inventory, null, 2)}

Sales History:
${JSON.stringify(salesHistory, null, 2)}

Instructions:
1. Identify products with low stock relative to their monthly sales velocity
2. Consider products with stock < 30 units as high urgency
3. Consider products with stock < 50 units as medium urgency
4. Consider sales trends and growth rates
5. Suggest appropriate restock quantities

Return ONLY a valid JSON array with the following structure:
[
  {
    "product_id": "PRD001",
    "name": "Product Name",
    "urgency": "high" | "medium" | "low",
    "reason": "Brief explanation",
    "suggested_quantity": number
  }
]

Limit to top 5 most urgent items. Return JSON only, no other text.
`;

  const response = await callLLM(prompt);
  const data = extractJSON(response);

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected array");
  }

  return data;
}

export async function getPriceOptimizations(
  inventory: Product[],
  salesHistory: SalesHistory[],
): Promise<unknown[]> {
  const prompt = `
You are a pricing strategy AI assistant. Analyze the following inventory and sales data to suggest optimal price adjustments.

Inventory Data:
${JSON.stringify(inventory, null, 2)}

Sales History:
${JSON.stringify(salesHistory, null, 2)}

Instructions:
1. Analyze demand trends (growth rate, sales pattern)
2. Consider stock availability (low stock may justify price increase)
3. Suggest price adjustments based on market dynamics
4. Keep changes reasonable (typically ±15%)
5. Provide clear reasoning for each suggestion

Return ONLY a valid JSON array with the following structure:
[
  {
    "product_id": "PRD001",
    "name": "Product Name",
    "current_price": number,
    "suggested_price": number,
    "change_percentage": number,
    "reasoning": "Brief explanation of why this price makes sense"
  }
]

Limit to top 5 recommendations. Return JSON only, no other text.
`;

  const response = await callLLM(prompt);
  const data = extractJSON(response);

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected array");
  }

  return data;
}

export async function getTrendingProducts(
  inventory: Product[],
  salesHistory: SalesHistory[],
): Promise<unknown[]> {
  const prompt = `
You are a trend analysis AI assistant. Identify products with high sales potential based on inventory and sales data.

Inventory Data:
${JSON.stringify(inventory, null, 2)}

Sales History:
${JSON.stringify(salesHistory, null, 2)}

Instructions:
1. Analyze growth rates and sales trends
2. Look for products with consistent upward momentum
3. Consider both absolute sales and growth percentage
4. Identify products likely to see increased demand
5. Provide trend analysis and projected sales increase

Return ONLY a valid JSON array with the following structure:
[
  {
    "product_id": "PRD001",
    "name": "Product Name",
    "category": "Category",
    "growth_potential": "high" | "medium" | "low",
    "trend_analysis": "Brief analysis of why this product is trending",
    "projected_sales_increase": number (percentage)
  }
]

Limit to top 5 trending products. Return JSON only, no other text.
`;

  const response = await callLLM(prompt);
  const data = extractJSON(response);

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected array");
  }

  return data;
}

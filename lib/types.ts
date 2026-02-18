// Inventory and Sales Types
export interface Product {
  product_id: string;
  name: string;
  category: string;
  current_stock: number;
  price: number;
  monthly_sales: number;
}

export interface SalesHistory {
  product_id: string;
  monthly_sales: number[];
  growth_rate: number;
}

export interface ProductWithSales extends Product {
  sales_history: SalesHistory;
}

// AI Response Types
export interface RestockSuggestion {
  product_id: string;
  name: string;
  urgency: "high" | "medium" | "low";
  reason: string;
  suggested_quantity: number;
}

export interface PriceOptimization {
  product_id: string;
  name: string;
  current_price: number;
  suggested_price: number;
  change_percentage: number;
  reasoning: string;
}

export interface TrendingProduct {
  product_id: string;
  name: string;
  category: string;
  growth_potential: "high" | "medium" | "low";
  trend_analysis: string;
  projected_sales_increase: number;
}

// AI Request/Response Types for Ollama (legacy)
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

// AI Request/Response Types for Gemini
export interface GeminiContent {
  parts: GeminiPart[];
  role?: string;
}

export interface GeminiPart {
  text: string;
}

export interface GeminiRequest {
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  index?: number;
  safetyRatings?: GeminiSafetyRating[];
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export type AIRequest = OllamaRequest;
export type AIResponse = OllamaResponse;

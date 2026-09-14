import type { Analysis } from "../components/AnalysisResult";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export async function analyzeGithubUser(username: string): Promise<{
  response: Response;
  data: Analysis | string | Record<string, unknown>;
}> {
  const response = await fetch(
    `${API_BASE}/analyzer/ai/${encodeURIComponent(username)}`
  );

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return { response, data };
}

export { API_BASE };
import "server-only";

export interface Insight {
  summary: string;
  kpis: { label: string; value: number }[];
  byCategory: Record<string, number>;
}

export async function fetchInsights(): Promise<Insight> {
  /* 1️⃣  Fake rows (replace when real DB ready) */
  const rows = [
    { category: "Housing" },
    { category: "Health" },
    { category: "Housing" },
    { category: "Food" },
    { category: "Employment" },
    { category: "Housing" },
  ];

  /* 2️⃣  Aggregate for chart / KPIs */
  const byCategory: Record<string, number> = {};
  rows.forEach((r) => {
    byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
  });

  const kpis = [
    { label: "Total Clients", value: rows.length },
    { label: "Housing Cases", value: byCategory.Housing },
    { label: "Health Cases", value: byCategory.Health },
  ];

  /* 3️⃣  Build a compact JSON summary to feed Cerebras */
  const prompt = `
You are a data analyst at a homeless‑services nonprofit.
Given this JSON, write an 80‑word, human‑friendly insight about
which services need attention and any notable trends.

JSON:
${JSON.stringify({ kpis, byCategory }, null, 2)}
  `.trim();

  /* 4️⃣  Call Cerebras‑GPT (real request) */
  const res = await fetch(process.env.CEREBRAS_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CEREBRAS_KEY}`,
    },
    body: JSON.stringify({
      model: "cerebras‑gpt‑13b", // change to the model you enabled
      prompt,
      max_tokens: 120,
      temperature: 0.3,
    }),
    // Edge functions or 10 s timeout recommended
  });

  if (!res.ok) {
    console.error("Cerebras error", await res.text());
    // graceful fallback
    return {
      summary:
        "Unable to fetch AI insight right now. Housing remains the top category.",
      kpis,
      byCategory,
    };
  }

  const data = await res.json(); // {choices:[{text:"…"}]}
  const summary: string =
    data.choices?.[0]?.text?.trim() ?? "No summary returned from Cerebras.";

  return { summary, kpis, byCategory };
}

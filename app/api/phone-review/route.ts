import { PhoneQuerySchema } from "@/components/ZodSchema";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    
    const body = await req.json();


    const ZodParsed = PhoneQuerySchema.safeParse(body);

    if (!ZodParsed.success) {

      return NextResponse.json(
        { error: "Invalid input", details: ZodParsed.error.issues },
        { status: 400 }
      );
    }

    const { query } = ZodParsed.data;
    const cacheKey = `phone:${query.toLowerCase()}`;

    // =============== CHECK CACHE ===============
    const cached = await redis.get(cacheKey);
    if (cached) {

      return NextResponse.json(cached);
    }

    // =============== USE GPT ONLY ===============
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
const prompt = `
You are an expert smartphone identification and review AI.
USER QUERY: "${query}"

Your task is to precisely detect the intended smartphone model from ANY type of user input.
The model MUST:
- Correct spelling mistakes and noisy queries (e.g., "ipohne 16", "s24u", "note 10+").
- Match old, new, discontinued, rare, upcoming, or classic smartphones.
- Always return the closest valid real phone if ANY reasonable match exists.
- Prefer official names from major brands (Apple, Samsung, Xiaomi, Huawei, Oppo, Google, etc.)
- If the query partially matches multiple phones, choose the MOST LIKELY one based on popularity and naming patterns.

### IMPORTANT MATCHING RULES
- Normalize noisy input (remove extra words like "pls", "plus review", "phone", "mobile").
- Understand shorthand (e.g., "s23u" → Samsung Galaxy S23 Ultra).
- Understand partial model names (e.g., "a51" → Samsung Galaxy A51).
- Understand year-based queries (e.g., "iPhone 2018" → iPhone XR / XS depending on context).
- Understand series-based queries (e.g., "redmi note 13" → pick the base model if variant is not specified).

### OUTPUT FORMAT
If the phone exists, return EXACTLY this JSON structure:
{
  "name": "",
  "image": "",
  "summary": "",
  "specs": {
    "cpu": "",
    "battery": "",
    "batteryCapacity": "",
    "fastCharging": false,
    "camera": "",
    "frontCamera": "",
    "video": "",
    "screen": "",
    "displayType": "",
    "resolution": "",
    "storage": "",
    "ram": "",
    "os": "",
    "support5G": false,
    "sim": "",
    "sensors": "",
    "colors": []
  },
  "network": "",
  "material": "",
  "protection": "",
  "dimensions": "",
  "weight": "",
  "price": "",
  "rating": 0,
  "youtubeReviewId": ""
}

### SUMMARY RULES 

Write a concise and professional 4–6 sentence summary.

Clearly state category (budget / mid-range / flagship).

Highlight key strengths (performance, camera, battery, display).

Mention notable weaknesses honestly and objectively without exaggeration.

Assess the value-for-money briefly (good / average / weak).

Identify who this phone is suitable for (optional short mention).

Avoid marketing language; keep it neutral and realistic.

Do NOT repeat specs or give long explanations.
### WHEN PHONE DOES NOT EXIST
If NO REAL smartphone can be matched after careful analysis, return ONLY:
{}

### GENERAL RULES
- NEVER invent unknown or unreleased specs.
- NEVER output text outside of JSON.
- NEVER call external APIs.
- Output must ALWAYS be clean, valid JSON.
`;




    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    const output = response.output_text || "";
    const firstBrace = output.indexOf("{");
    const lastBrace = output.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {

      return NextResponse.json({}, { status: 200 });
    }

    let parsed;
    try {
      parsed = JSON.parse(output.substring(firstBrace, lastBrace + 1));

    } catch {

      return NextResponse.json({}, { status: 200 });
    }

 if (!parsed.name) {


  return NextResponse.json({}, { status: 200 });
}


    await redis.set(cacheKey, parsed, { ex: 60 * 60 *24 * 90 });
  

    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error("🔥 SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error", info: err.message },
      { status: 500 }
    );
  }
}

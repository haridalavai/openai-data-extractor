import { Hono } from "hono";
import { handle } from "hono/vercel";
import openai from "../common/openai";
import { prepareFileExtractionPrompt } from "../utils";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.post("/extract-data", async (c) => {
  const body = await c.req.parseBody();
  console.log(body["data_file"]);

  const file = body["data_file"] as File;

  const content = await prepareFileExtractionPrompt(file);

  console.log(content);

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: content,
    response_format: { type: "json_object" },
  });
  console.log(result.choices[0]);

  return c.json({
    message: JSON.parse(result.choices[0].message.content as string),
  });
});

export const GET = handle(app);
export const POST = handle(app);

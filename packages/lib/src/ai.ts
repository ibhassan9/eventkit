import Anthropic from "@anthropic-ai/sdk";

let anthropicInstance: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return anthropicInstance;
}

export async function generateStructuredOutput<T>(params: {
  systemPrompt: string;
  userMessage: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const client = getAnthropic();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: params.maxTokens ?? 2048,
    system: params.systemPrompt,
    messages: [{ role: "user", content: params.userMessage }],
    tools: [
      {
        name: params.toolName,
        description: params.toolDescription,
        input_schema: params.inputSchema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool" as const, name: params.toolName },
  });

  const toolUseBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUseBlock) {
    throw new Error("AI did not return structured output");
  }

  return toolUseBlock.input as T;
}

export const AI_PROMPTS = {
  websiteGenerator: `You are an expert event website designer. Given event details, generate a complete website configuration with compelling copy, appropriate sections, and a cohesive color theme. Write professional, engaging content.`,
  registrationFormBuilder: `You are a registration form designer. Given event details, suggest appropriate custom registration fields. Consider the event type and what information organizers typically need. Return practical, relevant fields.`,
  emailWriter: `You are an email copywriter for event management. Generate professional event emails. Available merge tags: {{firstName}}, {{lastName}}, {{eventName}}, {{eventDate}}, {{ticketType}}, {{qrCode}}. Always address the recipient by {{firstName}}.`,
  badgeDesigner: `You are a badge layout designer for events. Given event details and theme colors, suggest a badge configuration with appropriate field placement, font sizes, and visual hierarchy.`,
  descriptionEnhancer: `You are a copywriter specializing in event descriptions. Take a raw event description and enhance it to be more professional, compelling, and well-structured while preserving all key details.`,
} as const;

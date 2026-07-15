import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createGateway } from "./ai-gateway.server";

const MODEL = "google/gemini-2.5-flash";

async function run(system: string, prompt: string) {
  const gateway = createGateway();
  const { text } = await generateText({
    model: gateway(MODEL),
    system,
    prompt,
  });
  return { text };
}

// EMAIL
const EmailInput = z.object({
  recipientName: z.string().default(""),
  recipientRole: z.string().default(""),
  subject: z.string().default(""),
  purpose: z.string().min(1),
  keyPoints: z.string().default(""),
  extra: z.string().default(""),
  tone: z.string().default("Professional"),
  audience: z.string().default("Client"),
});
export const generateEmailFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert professional email writer. Produce a polished, ready-to-send email in plain text with a clear subject line, greeting, body, and sign-off. Match the requested tone precisely. Be concise and effective.`;
    const prompt = `Write an email with the following brief:
- Recipient name: ${data.recipientName || "(unspecified)"}
- Recipient role: ${data.recipientRole || "(unspecified)"}
- Audience type: ${data.audience}
- Tone: ${data.tone}
- Subject hint: ${data.subject || "(let AI craft one)"}
- Purpose: ${data.purpose}
- Key points to include: ${data.keyPoints || "(none)"}
- Additional instructions: ${data.extra || "(none)"}

Format:
Subject: <subject line>

<full email body>`;
    return run(system, prompt);
  });

// MEETING NOTES
const NotesInput = z.object({ notes: z.string().min(10) });
export const summarizeNotesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an executive assistant that summarizes meeting notes into structured, decision-ready markdown.`;
    const prompt = `Summarize the following meeting notes. Use this exact markdown structure with headings:

## Executive Summary
## Key Discussion Points
## Important Decisions
## Action Items
## Assigned Responsibilities
## Deadlines
## Risks
## Next Meeting

Use bullet lists. Bold important dates and names. If a section has no content, write "None identified."

Meeting notes:
"""
${data.notes}
"""`;
    return run(system, prompt);
  });

// TASK PLANNER
const PlannerInput = z.object({
  tasks: z.string().min(1),
  deadlines: z.string().default(""),
  workingHours: z.string().default("9:00 - 17:00"),
  priority: z.string().default("Mixed"),
  meetings: z.string().default(""),
});
export const planTasksFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are a productivity coach that builds realistic, time-blocked schedules.`;
    const prompt = `Build a personalized plan using this exact markdown structure:

## Daily Schedule
(Time-blocked hourly plan for today)

## Weekly Planner
(Monday–Friday overview)

## Time Blocking Strategy

## Priority Matrix
(Urgent/Important quadrants)

## Productivity Tips

## Time Saving Suggestions

Inputs:
- Tasks: ${data.tasks}
- Deadlines: ${data.deadlines || "(unspecified)"}
- Working hours: ${data.workingHours}
- Priority level: ${data.priority}
- Meeting times: ${data.meetings || "(none)"}`;
    return run(system, prompt);
  });

// RESEARCH
const ResearchInput = z.object({ topic: z.string().min(2), context: z.string().default("") });
export const researchFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are a business research analyst. Provide balanced, well-sourced-in-spirit briefings.`;
    const prompt = `Research the topic and produce this exact markdown structure:

## Summary
## Key Insights
## Advantages
## Disadvantages
## Recommendations
## Conclusion
## Suggested Resources
## Next Steps

Topic: ${data.topic}
Additional context: ${data.context || "(none)"}`;
    return run(system, prompt);
  });

// CHAT
const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() })).min(1),
});
export const chatFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const gateway = createGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system: `You are the AI Workplace Productivity Assistant. Help professionals write emails, summarize meetings, plan work, and research topics. Be concise, warm, and practical. Use markdown formatting when helpful.`,
      messages: data.messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
    });
    return { text };
  });

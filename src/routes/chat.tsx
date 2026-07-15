import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatFn } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addActivity } from "@/lib/history";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — AI Workplace" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Write a professional email",
  "Summarize my meeting",
  "Plan my work week",
  "Explain Artificial Intelligence",
  "Research Digital Transformation",
  "Help prepare for an interview",
];

function ChatPage() {
  const chat = useServerFn(chatFn);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { text: reply } = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
      addActivity({ type: "chat", title: content.slice(0, 60), content: reply });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col gap-4">
      <PageHeader title="AI Chatbot" description="Your always-on workplace assistant." icon={MessageSquare} />
      <ResponsibleAINotice />

      <div ref={scrollRef} className="glass-card flex-1 overflow-y-auto rounded-2xl p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl btn-hero">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">How can I help you today?</h3>
            <p className="text-sm text-muted-foreground">Try one of these prompts to get started</p>
            <div className="mt-5 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border bg-card/60 p-3 text-left text-sm transition-colors hover:border-brand-purple hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[85%] text-sm">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-brand-purple">
                      <Sparkles className="h-3 w-3" /> Assistant
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-purple" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-pink [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-blue [animation-delay:240ms]" />
                <span className="ml-2">Thinking…</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything…"
            className="max-h-40 min-h-[44px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <Button className="btn-hero" size="icon" onClick={() => send()} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

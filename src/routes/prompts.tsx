import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Star } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/lib/history";
import { toast } from "sonner";

export const Route = createFileRoute("/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — AI Workplace" }] }),
  component: PromptsPage,
});

const templates = [
  { id: "email", category: "Professional Email", title: "Client status update", prompt: "Write a concise weekly status update for a client covering progress, blockers, and next steps." },
  { id: "email-2", category: "Professional Email", title: "Polite follow-up", prompt: "Write a polite follow-up email after a week of no response, restating the ask." },
  { id: "meeting", category: "Meeting Summary", title: "Standup recap", prompt: "Summarize this standup: highlight decisions, blockers, and owner assignments." },
  { id: "planning", category: "Project Planning", title: "Sprint plan", prompt: "Create a 2-week sprint plan for a small team given the following goals and capacity." },
  { id: "research-1", category: "Research", title: "Market landscape", prompt: "Give me a market landscape briefing for [industry] with key players, trends, and risks." },
  { id: "brainstorm", category: "Brainstorming", title: "Feature ideas", prompt: "Brainstorm 10 novel product features for [audience] and rank them by impact vs. effort." },
  { id: "interview", category: "Interview Preparation", title: "Behavioral interview prep", prompt: "Ask me 5 behavioral interview questions for a Senior PM role and give feedback on my answers." },
];

function PromptsPage() {
  const { favs, toggle } = useFavourites();
  const use = async (p: string) => {
    await navigator.clipboard.writeText(p);
    toast.success("Prompt copied — paste it into the AI Chatbot");
  };

  const grouped = templates.reduce<Record<string, typeof templates>>((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Prompt Library" description="Reusable, battle-tested prompts for common workplace tasks." icon={BookMarked} />
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => {
              const isFav = favs.includes(t.id);
              return (
                <div key={t.id} className="glass-card rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{t.title}</h3>
                    <button onClick={() => toggle(t.id)} aria-label="Favourite">
                      <Star className={`h-4 w-4 ${isFav ? "fill-brand-pink text-brand-pink" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.prompt}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => use(t.prompt)}>Copy</Button>
                    <Button size="sm" asChild className="btn-hero">
                      <Link to="/chat">Use in Chat</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

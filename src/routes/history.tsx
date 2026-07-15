import { createFileRoute } from "@tanstack/react-router";
import { History as HistoryIcon, Mail, FileText, CalendarCheck, Sparkles, MessageSquare, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { clearHistory, useHistory } from "@/lib/history";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — AI Workplace" }] }),
  component: HistoryPage,
});

const icons = { email: Mail, notes: FileText, planner: CalendarCheck, research: Sparkles, chat: MessageSquare } as const;

function HistoryPage() {
  const items = useHistory();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="History" description="Everything you've generated in this browser." icon={HistoryIcon} />
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => { clearHistory(); setOpenId(null); }} disabled={items.length === 0}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Clear all
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="glass-card rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          Nothing yet — try a feature to build your history.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <ol className="space-y-2">
            {items.map((h) => {
              const Icon = icons[h.type];
              return (
                <li key={h.id}>
                  <button
                    onClick={() => setOpenId(h.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${openId === h.id ? "border-brand-purple bg-accent" : "bg-card/60 hover:bg-accent/50"}`}
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-brand-purple">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{formatDistanceToNow(h.createdAt, { addSuffix: true })}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="glass-card rounded-2xl p-5">
            {open ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{open.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">Select an item to preview.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

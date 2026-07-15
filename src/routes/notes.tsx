import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotesFn } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addActivity } from "@/lib/history";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — AI Workplace" }] }),
  component: NotesPage,
});

function NotesPage() {
  const summarize = useServerFn(summarizeNotesFn);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (notes.trim().length < 10) {
      toast.error("Paste at least a few lines of meeting notes");
      return;
    }
    setLoading(true);
    try {
      const { text } = await summarize({ data: { notes } });
      setOutput(text);
      addActivity({ type: "notes", title: `Meeting summary (${notes.split(" ").length} words)`, content: text });
      toast.success("Notes summarized");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Meeting Notes Summarizer" description="Turn raw notes into a decision-ready brief." icon={FileText} />
      <ResponsibleAINotice />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-3 rounded-2xl p-5">
          <label className="text-sm font-medium">Paste meeting notes</label>
          <Textarea rows={16} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your raw meeting notes here…" />
          <div className="flex flex-wrap gap-2">
            <Button className="btn-hero" onClick={run} disabled={loading}>{loading ? "Summarizing…" : "Summarize"}</Button>
            <Button variant="outline" onClick={() => { setNotes(""); setOutput(""); }}>Clear</Button>
          </div>
        </div>
        <AIOutput text={output} loading={loading} onRegenerate={run} filename="meeting-summary.md" />
      </div>
    </div>
  );
}

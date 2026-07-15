import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { researchFn } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addActivity } from "@/lib/history";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — AI Workplace" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const research = useServerFn(researchFn);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (topic.trim().length < 2) {
      toast.error("Enter a topic to research");
      return;
    }
    setLoading(true);
    try {
      const { text } = await research({ data: { topic, context } });
      setOutput(text);
      addActivity({ type: "research", title: topic, content: text });
      toast.success("Research complete");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="AI Research Assistant" description="Fast, structured briefings on any topic." icon={Sparkles} />
      <ResponsibleAINotice />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-3 rounded-2xl p-5">
          <div><Label>Topic *</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Digital transformation in retail" /></div>
          <div><Label>Additional context</Label><Textarea rows={5} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Any specific angle, region, or constraints…" /></div>
          <div className="flex flex-wrap gap-2">
            <Button className="btn-hero" onClick={run} disabled={loading}>{loading ? "Researching…" : "Research"}</Button>
            <Button variant="outline" onClick={() => { setTopic(""); setContext(""); setOutput(""); }}>Clear</Button>
          </div>
        </div>
        <AIOutput text={output} loading={loading} onRegenerate={run} filename="research.md" />
      </div>
    </div>
  );
}

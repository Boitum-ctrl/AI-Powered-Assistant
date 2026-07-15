import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planTasksFn } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addActivity } from "@/lib/history";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — AI Workplace" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const plan = useServerFn(planTasksFn);
  const [form, setForm] = useState({
    tasks: "",
    deadlines: "",
    workingHours: "9:00 - 17:00",
    priority: "Mixed",
    meetings: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!form.tasks.trim()) {
      toast.error("Add at least one task");
      return;
    }
    setLoading(true);
    try {
      const { text } = await plan({ data: form });
      setOutput(text);
      addActivity({ type: "planner", title: "Weekly plan", content: text });
      toast.success("Plan generated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="AI Task Planner" description="Turn a task list into a smart, time-blocked plan." icon={CalendarCheck} />
      <ResponsibleAINotice />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-3 rounded-2xl p-5">
          <div><Label>Tasks *</Label><Textarea rows={5} value={form.tasks} onChange={(e) => setForm({ ...form, tasks: e.target.value })} placeholder="- Finish Q3 report\n- Reply to client\n- Prep for board meeting" /></div>
          <div><Label>Deadlines</Label><Textarea rows={2} value={form.deadlines} onChange={(e) => setForm({ ...form, deadlines: e.target.value })} placeholder="Report by Friday" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Working Hours</Label><Input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} /></div>
            <div>
              <Label>Priority Level</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Low", "Mixed", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Meeting Times</Label><Textarea rows={2} value={form.meetings} onChange={(e) => setForm({ ...form, meetings: e.target.value })} placeholder="Tue 10:00 standup, Wed 14:00 client" /></div>
          <div className="flex flex-wrap gap-2">
            <Button className="btn-hero" onClick={run} disabled={loading}>{loading ? "Planning…" : "Generate Plan"}</Button>
            <Button variant="outline" onClick={() => setOutput("")}>Clear Output</Button>
          </div>
        </div>
        <AIOutput text={output} loading={loading} editable onChange={setOutput} onRegenerate={run} filename="plan.md" />
      </div>
    </div>
  );
}

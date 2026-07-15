import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmailFn } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addActivity } from "@/lib/history";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — AI Workplace" }] }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Professional", "Persuasive", "Apology", "Follow-up", "Thank You", "Reminder"];
const AUDIENCES = ["Client", "Manager", "Employee", "Supplier", "Customer"];

function EmailPage() {
  const generate = useServerFn(generateEmailFn);
  const [form, setForm] = useState({
    recipientName: "",
    recipientRole: "",
    subject: "",
    purpose: "",
    keyPoints: "",
    extra: "",
    tone: "Professional",
    audience: "Client",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const run = async () => {
    if (!form.purpose.trim()) {
      toast.error("Please describe the email's purpose");
      return;
    }
    setLoading(true);
    try {
      const { text } = await generate({ data: form });
      setOutput(text);
      addActivity({ type: "email", title: form.subject || `Email to ${form.recipientName || form.audience}`, content: text });
      toast.success("Email generated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setForm({ recipientName: "", recipientRole: "", subject: "", purpose: "", keyPoints: "", extra: "", tone: "Professional", audience: "Client" });
    setOutput("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Smart Email Generator" description="Draft polished emails in seconds." icon={Mail} />
      <ResponsibleAINotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-4 rounded-2xl p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Recipient Name</Label><Input value={form.recipientName} onChange={upd("recipientName")} placeholder="Alex Chen" /></div>
            <div><Label>Recipient Role</Label><Input value={form.recipientRole} onChange={upd("recipientRole")} placeholder="Head of Marketing" /></div>
          </div>
          <div><Label>Subject</Label><Input value={form.subject} onChange={upd("subject")} placeholder="Q3 Campaign Kickoff" /></div>
          <div>
            <Label>Purpose *</Label>
            <Textarea rows={3} value={form.purpose} onChange={upd("purpose")} placeholder="Propose a kickoff meeting for the Q3 campaign and align on scope." />
          </div>
          <div><Label>Key Points</Label><Textarea rows={3} value={form.keyPoints} onChange={upd("keyPoints")} placeholder="- Budget: $50k\n- Timeline: 6 weeks" /></div>
          <div><Label>Additional Instructions</Label><Textarea rows={2} value={form.extra} onChange={upd("extra")} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(v) => setForm((f) => ({ ...f, tone: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={form.audience} onValueChange={(v) => setForm((f) => ({ ...f, audience: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AUDIENCES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="btn-hero" onClick={run} disabled={loading}>{loading ? "Generating…" : "Generate"}</Button>
            <Button variant="outline" onClick={clear}>Clear</Button>
          </div>
        </div>

        <AIOutput
          text={output}
          loading={loading}
          editable
          onChange={setOutput}
          onRegenerate={run}
          filename="email.txt"
        />
      </div>
    </div>
  );
}

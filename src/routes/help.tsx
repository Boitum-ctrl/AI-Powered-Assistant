import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & About — AI Workplace" }] }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Help & About" description="How this app works, and how we use AI responsibly." icon={HelpCircle} />
      <ResponsibleAINotice />
      <div className="glass-card space-y-4 rounded-2xl p-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold gradient-text">About</h2>
          <p className="mt-1 text-muted-foreground">
            AI Workplace Productivity Assistant helps professionals automate repetitive workplace tasks:
            emails, meeting summaries, planning, research, and general Q&A.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold gradient-text">Privacy Policy</h2>
          <p className="mt-1 text-muted-foreground">
            Your inputs are sent to an AI model to generate responses. History is stored locally in your browser
            and can be cleared at any time from Settings. Do not enter confidential company information.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold gradient-text">Responsible AI Statement</h2>
          <ul className="mt-1 list-disc space-y-1 pl-6 text-muted-foreground">
            <li>AI outputs may contain inaccuracies — always verify.</li>
            <li>Outputs may reflect biases present in training data.</li>
            <li>Human review is required before publishing or sending.</li>
            <li>We do not use your inputs to train the underlying models.</li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">Version 1.0.0</div>
      </div>
    </div>
  );
}

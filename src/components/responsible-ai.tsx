import { AlertTriangle, ShieldCheck, Eye, UserCheck } from "lucide-react";

export function ResponsibleAINotice() {
  const items = [
    { icon: AlertTriangle, title: "Responsible AI", text: "AI-generated content may contain inaccuracies. Always verify important information." },
    { icon: ShieldCheck, title: "Privacy", text: "Do not enter confidential company information." },
    { icon: Eye, title: "Bias Warning", text: "Outputs may reflect limitations in training data." },
    { icon: UserCheck, title: "Human Review", text: "Always review AI content before sending or publishing." },
  ];
  return (
    <div className="grid gap-2 rounded-2xl border bg-accent/40 p-4 text-xs text-accent-foreground sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <div key={i.title} className="flex min-w-0 items-start gap-2">
          <i.icon className="h-4 w-4 shrink-0 text-brand-purple" />
          <div className="min-w-0">
            <div className="font-semibold">{i.title}</div>
            <div className="text-muted-foreground">{i.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

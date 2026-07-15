import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, Sparkles, MessageSquare, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/lib/history";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Tumie's Collections" },
      { name: "description", content: "Admin workspace for Tumie's Collections — hair, makeup and fashion." },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { title: "Generate Email", to: "/email", icon: Mail, gradient: "from-brand-pink to-brand-purple" },
  { title: "Summarize Notes", to: "/notes", icon: FileText, gradient: "from-brand-purple to-brand-blue" },
  { title: "Create Schedule", to: "/planner", icon: CalendarCheck, gradient: "from-brand-blue to-brand-purple" },
  { title: "Research Topic", to: "/research", icon: Sparkles, gradient: "from-brand-peach to-brand-pink" },
  { title: "Ask AI", to: "/chat", icon: MessageSquare, gradient: "from-brand-pink to-brand-blue" },
] as const;

function Dashboard() {
  const history = useHistory();
  const count = (type: string) => history.filter((h) => h.type === type).length;
  const stats = [
    { label: "Emails Generated", value: count("email"), icon: Mail },
    { label: "Meetings Summarized", value: count("notes"), icon: FileText },
    { label: "Tasks Planned", value: count("planner"), icon: CalendarCheck },
    { label: "Research Requests", value: count("research"), icon: Sparkles },
    { label: "Chat Sessions", value: count("chat"), icon: MessageSquare },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_45%)]" />
        <div className="relative">
          <div className="text-sm uppercase tracking-widest opacity-90">Welcome back</div>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold sm:text-4xl">
            Tumie's Collections — your AI-powered admin studio
          </h1>
          <p className="mt-3 max-w-xl text-white/85">
            Draft customer emails, summarize supplier meetings, plan launches and research beauty & fashion trends — all in one captivating workspace for hair, makeup and clothing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild size="lg" variant="secondary" className="bg-white text-brand-purple hover:bg-white/90">
              <Link to="/chat">
                Ask AI <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Link to="/email">Draft a customer email</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Today's productivity overview
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-brand-purple" />
              </div>
              <div className="mt-2 text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={`group relative overflow-hidden rounded-2xl p-4 text-white transition-transform hover:-translate-y-0.5 bg-gradient-to-br ${a.gradient}`}
            >
              <a.icon className="h-5 w-5 opacity-90" />
              <div className="mt-6 text-sm font-semibold">{a.title}</div>
              <ArrowRight className="absolute right-3 top-3 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-brand-purple" /> Recent activity
        </div>
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No activity yet. Try a quick action above to get started.
          </div>
        ) : (
          <ol className="space-y-2">
            {history.slice(0, 8).map((h) => (
              <li key={h.id} className="flex items-start gap-3 rounded-xl border bg-card/60 p-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-brand-purple">
                  {h.type === "email" && <Mail className="h-4 w-4" />}
                  {h.type === "notes" && <FileText className="h-4 w-4" />}
                  {h.type === "planner" && <CalendarCheck className="h-4 w-4" />}
                  {h.type === "research" && <Sparkles className="h-4 w-4" />}
                  {h.type === "chat" && <MessageSquare className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{h.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(h.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

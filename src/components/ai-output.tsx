import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function AIOutput({
  text,
  loading,
  onRegenerate,
  filename = "ai-output.md",
  editable = false,
  onChange,
}: {
  text: string;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold">AI Output</div>
        <div className="flex flex-wrap items-center gap-1">
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copy} disabled={!text}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={download} disabled={!text}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>

      {loading && !text ? (
        <div className="space-y-2">
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ) : editable && onChange ? (
        <textarea
          className="min-h-[280px] w-full resize-y rounded-xl border bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : text ? (
        <div className="prose prose-sm max-w-none dark:prose-invert [&_h2]:mt-4 [&_h2]:text-brand-purple">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Your AI output will appear here.
        </div>
      )}
    </div>
  );
}

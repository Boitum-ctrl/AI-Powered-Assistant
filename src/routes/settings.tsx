import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/lib/theme";
import { clearHistory } from "@/lib/history";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AI Workplace" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("md");
  const [notify, setNotify] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Personalize your workspace." icon={SettingsIcon} />
      <div className="glass-card space-y-6 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div><Label>Theme</Label><p className="text-xs text-muted-foreground">Light or dark appearance</p></div>
          <Button variant="outline" onClick={toggle}>{theme === "light" ? "Switch to Dark" : "Switch to Light"}</Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div><Label>Language</Label><p className="text-xs text-muted-foreground">Interface language</p></div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div><Label>Font size</Label><p className="text-xs text-muted-foreground">Reading comfort</p></div>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div><Label>Notifications</Label><p className="text-xs text-muted-foreground">Product tips and updates</p></div>
          <Switch checked={notify} onCheckedChange={setNotify} />
        </div>
        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <div><Label>Clear history</Label><p className="text-xs text-muted-foreground">Remove all locally-stored activity</p></div>
          <Button variant="destructive" onClick={() => { clearHistory(); toast.success("History cleared"); }}>Clear</Button>
        </div>
      </div>
    </div>
  );
}

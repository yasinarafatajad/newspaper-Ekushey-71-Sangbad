import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockSettings } from "@/data/mockData";
import { toast } from "sonner";

const SettingsPage = () => {
  const [settings, setSettings] = useState(mockSettings);

  const handleSave = () => {
    toast.success("Settings saved!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground mb-6">
        Settings
      </h1>

      <div className="max-w-lg space-y-5">
        <div>
          <Label className="font-body text-sm font-semibold">Site Name</Label>
          <Input
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Site Description</Label>
          <Textarea
            value={settings.siteDescription}
            onChange={(e) =>
              setSettings({ ...settings, siteDescription: e.target.value })
            }
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Site URL</Label>
          <Input
            value={settings.siteUrl}
            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Posts Per Page</Label>
          <Input
            type="number"
            value={settings.postsPerPage}
            onChange={(e) =>
              setSettings({ ...settings, postsPerPage: Number(e.target.value) })
            }
            className="mt-1 rounded-sm border-border font-body w-24"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label className="font-body text-sm font-semibold">Allow Comments</Label>
          <Switch
            checked={settings.allowComments}
            onCheckedChange={(v) => setSettings({ ...settings, allowComments: v })}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label className="font-body text-sm font-semibold">Moderate Comments</Label>
          <Switch
            checked={settings.moderateComments}
            onCheckedChange={(v) => setSettings({ ...settings, moderateComments: v })}
          />
        </div>

        <Button onClick={handleSave} className="rounded-sm">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;

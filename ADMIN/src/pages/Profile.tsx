import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mockUserProfile } from "@/data/mockData";
import { toast } from "sonner";

const Profile = () => {
  const [profile, setProfile] = useState(mockUserProfile);

  const handleSave = () => {
    toast.success("Profile updated!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground mb-6">
        Profile
      </h1>

      <div className="max-w-lg space-y-5">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            loading="lazy"
            className="h-16 w-16 rounded-sm object-cover border border-border"
          />
          <div>
            <p className="font-heading font-bold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground font-body">{profile.role}</p>
          </div>
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Name</Label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Email</Label>
          <Input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm font-semibold">Bio</Label>
          <Textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="mt-1 rounded-sm border-border font-body min-h-[100px]"
          />
        </div>

        <Button onClick={handleSave} className="rounded-sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;

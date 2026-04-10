"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocationData } from "@/types";

interface LocationEditorProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
}

export function LocationEditor({ data, onChange }: LocationEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="loc-venue">Venue Name</Label>
        <Input
          id="loc-venue"
          value={data.venue}
          onChange={(e) => onChange({ ...data, venue: e.target.value })}
          placeholder="Convention Center"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loc-address">Address</Label>
        <Input
          id="loc-address"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="123 Main St, Toronto, ON"
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@eventkit/ui/card";
import { ArrowRight } from "lucide-react";

export default function EventLookupPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slug.trim();
    if (trimmed) {
      router.push(`/${trimmed}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">EventKit</h1>
          <p className="text-sm text-muted-foreground">
            Enter an event code to find your event.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Find your event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="slug">Event Code</Label>
                <Input
                  id="slug"
                  placeholder="my-awesome-event"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  autoFocus
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={!slug.trim()}
                className="w-full"
              >
                Go to Event
                <ArrowRight data-icon="inline-end" className="ml-1.5 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

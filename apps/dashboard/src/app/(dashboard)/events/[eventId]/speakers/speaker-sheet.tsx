"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Textarea } from "@eventkit/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@eventkit/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@eventkit/ui/sheet";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();
import { useSaveSpeaker } from "@/hooks/use-speakers";

const speakerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  headshotUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
});

type SpeakerFormValues = z.infer<typeof speakerFormSchema>;

type SpeakerData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  headshotUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  sessionSpeakers: {
    session: {
      id: string;
      title: string;
    };
  }[];
};

interface SpeakerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  speaker: SpeakerData | null;
}

export function SpeakerSheet({
  open,
  onOpenChange,
  eventId,
  speaker,
}: SpeakerSheetProps) {
  const saveSpeaker = useSaveSpeaker();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerFormSchema) as Resolver<SpeakerFormValues>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      company: "",
      bio: "",
      headshotUrl: "",
      websiteUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (speaker) {
        reset({
          firstName: speaker.firstName,
          lastName: speaker.lastName,
          email: speaker.email ?? "",
          title: speaker.title ?? "",
          company: speaker.company ?? "",
          bio: speaker.bio ?? "",
          headshotUrl: speaker.headshotUrl ?? "",
          websiteUrl: speaker.websiteUrl ?? "",
          linkedinUrl: speaker.linkedinUrl ?? "",
          twitterUrl: speaker.twitterUrl ?? "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          title: "",
          company: "",
          bio: "",
          headshotUrl: "",
          websiteUrl: "",
          linkedinUrl: "",
          twitterUrl: "",
        });
      }
    }
  }, [open, speaker, reset]);

  const headshotUrl = watch("headshotUrl");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const initials = `${(firstName || "")[0] ?? ""}${(lastName || "")[0] ?? ""}`.toUpperCase();

  async function onSubmit(data: SpeakerFormValues) {
    const result = await saveSpeaker.mutateAsync({
      eventId,
      speakerId: speaker?.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      title: data.title || undefined,
      company: data.company || undefined,
      bio: data.bio || undefined,
      headshotUrl: data.headshotUrl || undefined,
      websiteUrl: data.websiteUrl || undefined,
      linkedinUrl: data.linkedinUrl || undefined,
      twitterUrl: data.twitterUrl || undefined,
    });

    if (result.success) {
      toast.success(speaker ? "Speaker updated" : "Speaker added");
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{speaker ? "Edit Speaker" : "Add Speaker"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-16 w-16" size="lg">
              {headshotUrl && (
                <AvatarImage src={headshotUrl} alt="Speaker headshot" />
              )}
              <AvatarFallback className="text-lg">{initials || "?"}</AvatarFallback>
            </Avatar>
            {headshotUrl ? (
              <button
                type="button"
                onClick={() => setValue("headshotUrl", "")}
                className="text-xs text-stone-500 hover:text-stone-700"
              >
                Remove photo
              </button>
            ) : (
              <UploadButton
                endpoint="speakerImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setValue("headshotUrl", res[0].serverData.url);
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="First name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="speaker@example.com"
              {...register("email")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="speakerTitle">Job Title</Label>
            <Input
              id="speakerTitle"
              placeholder="e.g. VP of Engineering"
              {...register("title")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="e.g. Acme Corp"
              {...register("company")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Short biography"
              rows={4}
              {...register("bio")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              placeholder="https://example.com"
              {...register("websiteUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/..."
              {...register("linkedinUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="twitterUrl">Twitter/X URL</Label>
            <Input
              id="twitterUrl"
              placeholder="https://x.com/..."
              {...register("twitterUrl")}
            />
          </div>

          {speaker && speaker.sessionSpeakers.length > 0 && (
            <div className="space-y-1.5">
              <Label>Sessions</Label>
              <div className="space-y-1.5 rounded-lg border p-3">
                {speaker.sessionSpeakers.map((ss) => (
                  <p key={ss.session.id} className="text-sm text-stone-600">
                    {ss.session.title}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || saveSpeaker.isPending}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {saveSpeaker.isPending ? "Saving..." : speaker ? "Update Speaker" : "Add Speaker"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

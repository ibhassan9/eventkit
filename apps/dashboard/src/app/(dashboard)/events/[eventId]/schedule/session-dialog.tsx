"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Textarea } from "@eventkit/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@eventkit/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@eventkit/ui/popover";
import { Calendar } from "@eventkit/ui/calendar";
import { useSaveSession } from "@/hooks/use-sessions";
import { useConfirmClose } from "@/hooks/use-confirm-close";
import { SpeakerSelect } from "./speaker-select";

const sessionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  track: z.string().optional(),
  capacity: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

type SessionData = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  location: string | null;
  track: string | null;
  capacity: number | null;
  sessionSpeakers: {
    speakerId: string;
    role: "speaker" | "moderator" | "panelist";
    sortOrder: number;
    speaker: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
};

type SpeakerData = {
  id: string;
  firstName: string;
  lastName: string;
};

type SelectedSpeaker = {
  speakerId: string;
  role: "speaker" | "moderator" | "panelist";
  sortOrder: number;
};

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  session: SessionData | null;
  speakers: SpeakerData[];
}

export function SessionDialog({
  open,
  onOpenChange,
  eventId,
  session,
  speakers,
}: SessionDialogProps) {
  const saveSession = useSaveSession();
  const [selectedSpeakers, setSelectedSpeakers] = useState<SelectedSpeaker[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema) as Resolver<SessionFormValues>,
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      track: "",
      capacity: "",
    },
  });

  const { handleOpenChange } = useConfirmClose({ isDirty, onOpenChange });

  useEffect(() => {
    if (open) {
      if (session) {
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        reset({
          title: session.title,
          description: session.description ?? "",
          date: format(start, "yyyy-MM-dd"),
          startTime: format(start, "HH:mm"),
          endTime: format(end, "HH:mm"),
          location: session.location ?? "",
          track: session.track ?? "",
          capacity: session.capacity ? String(session.capacity) : "",
        });
        setSelectedDate(start);
        setSelectedSpeakers(
          session.sessionSpeakers.map((ss) => ({
            speakerId: ss.speakerId,
            role: ss.role,
            sortOrder: ss.sortOrder,
          }))
        );
      } else {
        reset({
          title: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          track: "",
          capacity: "",
        });
        setSelectedDate(undefined);
        setSelectedSpeakers([]);
      }
    }
  }, [open, session, reset]);

  const dateValue = watch("date");

  async function onSubmit(data: SessionFormValues) {
    const startTime = new Date(`${data.date}T${data.startTime}:00`);
    const endTime = new Date(`${data.date}T${data.endTime}:00`);

    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }

    const result = await saveSession.mutateAsync({
      eventId,
      sessionId: session?.id,
      title: data.title,
      description: data.description || undefined,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      location: data.location || undefined,
      track: data.track || undefined,
      capacity: data.capacity ? parseInt(data.capacity, 10) : undefined,
      speakers: selectedSpeakers,
    });

    if (result.success) {
      toast.success(session ? "Session updated" : "Session created");
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{session ? "Edit Session" : "Add Session"}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Session title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Session description"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger
                  className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <span className={dateValue ? "text-foreground" : "text-muted-foreground"}>
                    {dateValue
                      ? format(new Date(dateValue + "T00:00:00"), "MMMM d, yyyy")
                      : "Select date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setValue("date", format(date, "yyyy-MM-dd"));
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime")}
                />
                {errors.startTime && (
                  <p className="text-xs text-destructive">{errors.startTime.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register("endTime")}
                />
                {errors.endTime && (
                  <p className="text-xs text-destructive">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Main Hall, Room 101"
                {...register("location")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="track">Track</Label>
              <Input
                id="track"
                placeholder="e.g. Engineering, Design"
                {...register("track")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                placeholder="Max attendees"
                {...register("capacity")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Speakers</Label>
              <SpeakerSelect
                speakers={speakers}
                selected={selectedSpeakers}
                onChange={setSelectedSpeakers}
                eventId={eventId}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" className="text-stone-600 hover:bg-stone-50" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || saveSession.isPending} className="bg-violet-600 hover:bg-violet-700 text-white">
              {saveSession.isPending ? "Saving..." : session ? "Update Session" : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

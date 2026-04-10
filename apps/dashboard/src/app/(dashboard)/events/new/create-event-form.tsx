"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@eventkit/ui/card";
import { createEventSchema, type CreateEventInput } from "@eventkit/lib/validators";
import { slugify } from "@eventkit/lib/utils";
import { createNewEvent } from "./actions";
import { EventFormFields } from "./event-form-fields";
import { TimezoneSelect } from "./timezone-select";
import { CurrencySelect } from "./currency-select";

export function CreateEventForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema) as Resolver<CreateEventInput>,
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      address: "",
      timezone: "America/Toronto",
      currency: "CAD",
    },
  });

  const timezone = watch("timezone");
  const currency = watch("currency");

  async function onSubmit(data: CreateEventInput) {
    const result = await createNewEvent({
      ...data,
      slug: slugify(data.name),
    });
    if (result.success) {
      toast.success("Event created successfully");
      router.push(`/events/${result.data.id}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EventFormFields
            register={register}
            errors={errors}
            onNameChange={(e) => setValue("name", e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TimezoneSelect
              value={timezone}
              onChange={(tz) => setValue("timezone", tz)}
            />
            <CurrencySelect
              value={currency}
              onChange={(c) => setValue("currency", c)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

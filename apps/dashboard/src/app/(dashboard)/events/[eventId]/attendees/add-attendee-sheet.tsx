"use client";

import { useState } from "react";
import { useForm, Controller, type Resolver, type Control, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Textarea } from "@eventkit/ui/textarea";
import { Checkbox } from "@eventkit/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@eventkit/ui/select";
import { RadioGroup, RadioGroupItem } from "@eventkit/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@eventkit/ui/sheet";
import { adminAddAttendeeSchema } from "@eventkit/lib/validators";
import { queryKeys } from "@/lib/query-keys";
import { addAttendee } from "./actions";
import type { CustomField } from "@eventkit/types";

type FormValues = z.infer<typeof adminAddAttendeeSchema>;

interface TicketTypeOption {
  id: string;
  name: string;
  price: number;
}

interface AddAttendeeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  ticketTypes: TicketTypeOption[];
  customFields: CustomField[];
}

interface SuccessData {
  attendeeName: string;
  email: string;
  ticketTypeName?: string;
  isNewUser: boolean;
  temporaryPassword?: string;
}

export function AddAttendeeSheet({
  open,
  onOpenChange,
  eventId,
  ticketTypes,
  customFields,
}: AddAttendeeSheetProps) {
  const [view, setView] = useState<"form" | "success">("form");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(adminAddAttendeeSchema) as Resolver<FormValues>,
    defaultValues: {
      eventId,
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      ticketTypeId: undefined,
      paymentStatus: "free",
      customFieldValues: {},
      sendWelcomeEmail: true,
    },
  });

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setView("form");
      setSuccessData(null);
      setCopied(false);
      setShowPassword(false);
      reset({
        eventId,
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        jobTitle: "",
        ticketTypeId: undefined,
        paymentStatus: "free",
        customFieldValues: {},
        sendWelcomeEmail: true,
      });
    }
    onOpenChange(isOpen);
  }

  async function onSubmit(data: FormValues) {
    const result = await addAttendee(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const ticketType = data.ticketTypeId
      ? ticketTypes.find((tt) => tt.id === data.ticketTypeId)
      : undefined;

    setSuccessData({
      attendeeName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      ticketTypeName: ticketType?.name,
      isNewUser: result.data.isNewUser,
      temporaryPassword: result.data.temporaryPassword,
    });
    setView("success");

    queryClient.invalidateQueries({ queryKey: queryKeys.attendees.all });
    toast.success("Attendee added successfully");
  }

  function handleAddAnother() {
    setView("form");
    setSuccessData(null);
    setCopied(false);
    setShowPassword(false);
    reset({
      eventId,
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      ticketTypeId: undefined,
      paymentStatus: "free",
      customFieldValues: {},
      sendWelcomeEmail: true,
    });
  }

  async function handleCopyCredentials() {
    if (!successData) return;
    const text = `Email: ${successData.email}\nTemporary Password: ${successData.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        {view === "form" ? (
          <>
            <SheetHeader>
              <SheetTitle>Add Attendee</SheetTitle>
              <SheetDescription>
                Manually add an attendee to this event
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 p-4"
            >
              <input type="hidden" {...register("eventId")} />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="add-firstName">First Name *</Label>
                  <Input
                    id="add-firstName"
                    placeholder="First name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="add-lastName">Last Name *</Label>
                  <Input
                    id="add-lastName"
                    placeholder="Last name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  placeholder="attendee@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-company">Company</Label>
                <Input
                  id="add-company"
                  placeholder="Company name"
                  {...register("company")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-jobTitle">Job Title</Label>
                <Input
                  id="add-jobTitle"
                  placeholder="Job title"
                  {...register("jobTitle")}
                />
              </div>

              {ticketTypes.length > 0 && (
                <div className="space-y-1.5">
                  <Label>Ticket Type</Label>
                  <Controller
                    name="ticketTypeId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ticketTypes.map((tt) => (
                            <SelectItem key={tt.id} value={tt.id}>
                              {tt.name}
                              {tt.price > 0 ? ` ($${(tt.price / 100).toFixed(2)})` : " (Free)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Payment Status</Label>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? "free"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {customFields.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Custom Fields
                  </p>
                  {customFields.map((field) => (
                    <CustomFieldInput
                      key={field.id}
                      field={field}
                      control={control}
                      register={register}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Controller
                  name="sendWelcomeEmail"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="add-sendWelcomeEmail"
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="add-sendWelcomeEmail" className="text-sm font-normal">
                  Send welcome email with login credentials
                </Label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Attendee"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Attendee Added</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 p-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">
                  Attendee added successfully
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </p>
                  <p className="mt-1 text-sm">{successData?.attendeeName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 text-sm">{successData?.email}</p>
                </div>
                {successData?.ticketTypeName && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ticket Type
                    </p>
                    <p className="mt-1 text-sm">
                      {successData.ticketTypeName}
                    </p>
                  </div>
                )}
              </div>

              {successData?.isNewUser && successData.temporaryPassword ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Login Credentials
                  </p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs text-amber-700">Email</p>
                      <p className="font-mono text-sm">
                        {successData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-700">
                        Temporary Password
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">
                          {showPassword
                            ? successData.temporaryPassword
                            : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          {showPassword ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!successData.temporaryPassword) return;
                            await navigator.clipboard.writeText(
                              successData.temporaryPassword
                            );
                            toast.success("Password copied to clipboard");
                          }}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={handleCopyCredentials}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    {copied ? "Copied!" : "Copy Credentials"}
                  </Button>
                  <p className="mt-2 text-xs text-amber-700">
                    Save these credentials — the password cannot be retrieved
                    later.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    This email is already registered. The attendee has been
                    added using their existing account.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddAnother}
                >
                  Add Another
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleOpenChange(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CustomFieldInput({
  field,
  control,
  register,
}: {
  field: CustomField;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
}) {
  const fieldName = `customFieldValues.${field.id}` as const;

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={`custom-${field.id}`}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <Input
            id={`custom-${field.id}`}
            placeholder={field.placeholder}
            {...register(fieldName)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={`custom-${field.id}`}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <Textarea
            id={`custom-${field.id}`}
            placeholder={field.placeholder}
            rows={3}
            {...register(fieldName)}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-1.5">
          <Label>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: formField }) => (
              <Select
                value={formField.value ?? ""}
                onValueChange={formField.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder ?? "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Controller
            name={fieldName}
            control={control}
            render={({ field: formField }) => (
              <Checkbox
                id={`custom-${field.id}`}
                checked={formField.value === "true"}
                onCheckedChange={(checked) =>
                  formField.onChange(checked ? "true" : "false")
                }
              />
            )}
          />
          <Label htmlFor={`custom-${field.id}`} className="text-sm font-normal">
            {field.label}
            {field.required ? " *" : ""}
          </Label>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-1.5">
          <Label>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: formField }) => (
              <RadioGroup
                value={formField.value ?? ""}
                onValueChange={formField.onChange}
              >
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`custom-${field.id}-${option}`} />
                    <Label
                      htmlFor={`custom-${field.id}-${option}`}
                      className="text-sm font-normal"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      );

    default:
      return null;
  }
}

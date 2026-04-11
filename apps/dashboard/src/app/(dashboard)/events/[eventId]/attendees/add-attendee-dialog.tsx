"use client";

import { useState } from "react";
import { useForm, Controller, type Resolver, type Control, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Copy, Eye, EyeOff, Loader2, Minus, Plus } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@eventkit/ui/dialog";
import { formatCurrency } from "@eventkit/lib/utils";
import { useConfirmClose } from "@/hooks/use-confirm-close";
import { queryKeys } from "@/lib/query-keys";
import { addAttendee } from "./actions";
import type { CustomField } from "@eventkit/types";

const formSchema = z.object({
  eventId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
  ticketTypeId: z.string().uuid().optional(),
  paymentStatus: z.enum(["free", "paid"]).optional(),
  customFieldValues: z.record(z.string(), z.string()).optional(),
  sendWelcomeEmail: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TicketTypeOption {
  id: string;
  name: string;
  price: number;
}

interface AddAttendeeDialogProps {
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

function TicketStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value === 0}
        className="flex h-7 w-7 items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-5 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled}
        className="flex h-7 w-7 items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export function AddAttendeeDialog({
  open,
  onOpenChange,
  eventId,
  ticketTypes,
  customFields,
}: AddAttendeeDialogProps) {
  const [view, setView] = useState<"form" | "success">("form");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ticketCart, setTicketCart] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
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

  const { handleOpenChange: confirmClose } = useConfirmClose({
    isDirty: view === "form" && isDirty,
    onOpenChange: handleOpenChange,
  });

  const cartTotal = Object.entries(ticketCart).reduce((sum, [id, qty]) => {
    const tt = ticketTypes.find((t) => t.id === id);
    return sum + (tt ? tt.price * qty : 0);
  }, 0);

  const cartItems = Object.entries(ticketCart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const tt = ticketTypes.find((t) => t.id === id)!;
      return { id, name: tt.name, price: tt.price, quantity: qty };
    });

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setView("form");
      setSuccessData(null);
      setCopied(false);
      setShowPassword(false);
      setTicketCart({});
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
    const firstTicketId = cartItems.length > 0 ? cartItems[0].id : undefined;

    const result = await addAttendee({
      ...data,
      ticketTypeId: firstTicketId,
      paymentStatus: cartTotal > 0 ? "paid" : "free",
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const ticketNames = cartItems.map((i) =>
      i.quantity > 1 ? `${i.quantity}× ${i.name}` : i.name
    ).join(", ");

    setSuccessData({
      attendeeName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      ticketTypeName: ticketNames || undefined,
      isNewUser: result.data.isNewUser,
      temporaryPassword: result.data.temporaryPassword,
    });
    setView("success");

    queryClient.invalidateQueries({ queryKey: queryKeys.attendees.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.ticketTypes.all });
    toast.success("Attendee added successfully");
  }

  function handleAddAnother() {
    setView("form");
    setSuccessData(null);
    setCopied(false);
    setShowPassword(false);
    setTicketCart({});
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
    <Dialog open={open} onOpenChange={confirmClose}>
      <DialogContent size="lg">
        {view === "form" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Attendee</DialogTitle>
              <DialogDescription>
                Manually add an attendee to this event
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-5">
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
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Assign Tickets
                  </p>
                  {ticketTypes.map((tt) => (
                    <div
                      key={tt.id}
                      className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          {tt.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {tt.price === 0
                            ? "Free"
                            : formatCurrency(tt.price, "CAD")}
                        </p>
                      </div>
                      <TicketStepper
                        value={ticketCart[tt.id] ?? 0}
                        onChange={(v) =>
                          setTicketCart((prev) => ({
                            ...prev,
                            [tt.id]: v,
                          }))
                        }
                      />
                    </div>
                  ))}
                  {cartItems.length > 0 && (
                    <div className="rounded-lg bg-stone-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-600">Total</span>
                        <span className="font-semibold text-stone-900">
                          {cartTotal === 0
                            ? "Free"
                            : formatCurrency(cartTotal, "CAD")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              <div className="flex items-center gap-2">
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
            </DialogBody>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="text-stone-600 hover:bg-stone-50"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-600 hover:bg-violet-700 text-white"
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
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Attendee Added</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-6">
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
                      Tickets
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
            </DialogBody>
            <DialogFooter>
              <Button
                variant="ghost"
                className="text-stone-600 hover:bg-stone-50"
                onClick={handleAddAnother}
              >
                Add Another
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
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

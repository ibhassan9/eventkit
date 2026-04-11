"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Textarea } from "@eventkit/ui/textarea";
import { Checkbox } from "@eventkit/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@eventkit/ui/dialog";
import { Separator } from "@eventkit/ui/separator";
import {
  useCreateTicketType,
  useUpdateTicketType,
} from "@/hooks/use-ticket-types";
import { useConfirmClose } from "@/hooks/use-confirm-close";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional(),
    price: z.number().min(0, "Price must be 0 or greater"),
    isFree: z.boolean(),
    capacity: z.string().optional(),
    allowWaitlist: z.boolean(),
    salesStart: z.string().optional(),
    salesEnd: z.string().optional(),
    minPerOrder: z.number().int().min(1),
    maxPerOrder: z.number().int().min(1),
    isVisible: z.boolean(),
  })
  .refine((data) => data.maxPerOrder >= data.minPerOrder, {
    message: "Maximum must be greater than or equal to minimum",
    path: ["maxPerOrder"],
  });

type FormValues = z.infer<typeof formSchema>;

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  soldCount: number;
  salesStart: Date | null;
  salesEnd: Date | null;
  sortOrder: number;
  isVisible: boolean;
  allowWaitlist: boolean;
  minPerOrder: number;
  maxPerOrder: number;
}

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  ticket: TicketType | null;
}

function toDateTimeLocal(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function TicketDialog({
  open,
  onOpenChange,
  eventId,
  ticket,
}: TicketDialogProps) {
  const isEditing = !!ticket;
  const createMutation = useCreateTicketType();
  const updateMutation = useUpdateTicketType();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isFree: true,
      capacity: "",
      allowWaitlist: false,
      salesStart: "",
      salesEnd: "",
      minPerOrder: 1,
      maxPerOrder: 10,
      isVisible: true,
    },
  });

  const { handleOpenChange } = useConfirmClose({ isDirty, onOpenChange });

  const isFree = watch("isFree");
  const capacityValue = watch("capacity");

  useEffect(() => {
    if (open && ticket) {
      reset({
        name: ticket.name,
        description: ticket.description ?? "",
        price: ticket.price / 100,
        isFree: ticket.price === 0,
        capacity: ticket.capacity?.toString() ?? "",
        allowWaitlist: ticket.allowWaitlist,
        salesStart: toDateTimeLocal(ticket.salesStart),
        salesEnd: toDateTimeLocal(ticket.salesEnd),
        minPerOrder: ticket.minPerOrder,
        maxPerOrder: ticket.maxPerOrder,
        isVisible: ticket.isVisible,
      });
    } else if (open && !ticket) {
      reset({
        name: "",
        description: "",
        price: 0,
        isFree: true,
        capacity: "",
        allowWaitlist: false,
        salesStart: "",
        salesEnd: "",
        minPerOrder: 1,
        maxPerOrder: 10,
        isVisible: true,
      });
    }
  }, [open, ticket, reset]);

  async function onSubmit(data: FormValues) {
    const priceInCents = data.isFree ? 0 : Math.round(data.price * 100);
    const capacity = data.capacity ? parseInt(data.capacity, 10) : null;

    const payload = {
      eventId,
      name: data.name,
      description: data.description || undefined,
      price: priceInCents,
      capacity: capacity ?? undefined,
      allowWaitlist: data.allowWaitlist,
      salesStart: data.salesStart ? new Date(data.salesStart) : undefined,
      salesEnd: data.salesEnd ? new Date(data.salesEnd) : undefined,
      minPerOrder: data.minPerOrder,
      maxPerOrder: data.maxPerOrder,
      isVisible: data.isVisible,
      sortOrder: ticket?.sortOrder ?? 0,
    };

    if (isEditing) {
      const result = await updateMutation.mutateAsync({
        ...payload,
        ticketTypeId: ticket.id,
      });
      if (result.success) {
        toast.success("Ticket updated");
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    } else {
      const result = await createMutation.mutateAsync(payload);
      if (result.success) {
        toast.success("Ticket created");
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update this ticket type's details."
                : "Add a new ticket type for your event."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-name">Ticket Name *</Label>
              <Input
                id="ticket-name"
                placeholder="e.g., General Admission"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                placeholder="e.g., Full access to all sessions and networking events"
                rows={2}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Separator />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pricing
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-price">Price</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">$</span>
                  <Input
                    id="ticket-price"
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={isFree}
                    {...register("price", { valueAsNumber: true })}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setValue("price", isNaN(val) ? 0 : val);
                      if (val === 0 || isNaN(val)) setValue("isFree", true);
                      else setValue("isFree", false);
                    }}
                  />
                  <span className="text-sm text-stone-500">CAD</span>
                </div>
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  name="isFree"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="ticket-free"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) setValue("price", 0);
                      }}
                    />
                  )}
                />
                <Label htmlFor="ticket-free" className="text-sm font-normal">
                  This is a free ticket
                </Label>
              </div>
            </div>

            <Separator />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Availability
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-capacity">Capacity</Label>
              <Input
                id="ticket-capacity"
                type="number"
                min="1"
                placeholder="Leave blank for unlimited"
                {...register("capacity")}
              />
              <p className="text-xs text-stone-400">
                Leave blank for unlimited capacity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="allowWaitlist"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="ticket-waitlist"
                    checked={field.value}
                    disabled={!capacityValue}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="ticket-waitlist" className="text-sm font-normal">
                Allow waitlist when sold out
              </Label>
            </div>

            <Separator />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sales Window
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-sales-start">Sales Start</Label>
              <Input
                id="ticket-sales-start"
                type="datetime-local"
                {...register("salesStart")}
              />
              <p className="text-xs text-stone-400">
                Leave blank to start selling immediately.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-sales-end">Sales End</Label>
              <Input
                id="ticket-sales-end"
                type="datetime-local"
                {...register("salesEnd")}
              />
              {errors.salesEnd && (
                <p className="text-xs text-destructive">
                  {errors.salesEnd.message}
                </p>
              )}
              <p className="text-xs text-stone-400">
                Leave blank to sell until the event ends.
              </p>
            </div>

            <Separator />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Order Limits
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-min">Minimum per order</Label>
                <Input
                  id="ticket-min"
                  type="number"
                  min="1"
                  {...register("minPerOrder", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ticket-max">Maximum per order</Label>
                <Input
                  id="ticket-max"
                  type="number"
                  min="1"
                  {...register("maxPerOrder", { valueAsNumber: true })}
                />
                {errors.maxPerOrder && (
                  <p className="text-xs text-destructive">
                    {errors.maxPerOrder.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Visibility
            </p>

            <div className="flex items-center gap-2">
              <Controller
                name="isVisible"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="ticket-visible"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <Label htmlFor="ticket-visible" className="text-sm font-normal">
                  Show on registration page
                </Label>
                <p className="text-xs text-stone-400">
                  When hidden, this ticket will not appear on the public registration
                  form.
                </p>
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              className="text-stone-600 hover:bg-stone-50"
              onClick={() => onOpenChange(false)}
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
                  Saving...
                </>
              ) : (
                "Save Ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

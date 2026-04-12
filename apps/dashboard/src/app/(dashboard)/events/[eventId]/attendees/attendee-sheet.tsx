"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@eventkit/ui/badge";
import { Button } from "@eventkit/ui/button";
import { Separator } from "@eventkit/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@eventkit/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@eventkit/ui/alert-dialog";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Loader2,
  UserPlus,
  ExternalLink,
  Ban,
} from "lucide-react";
import { formatDate, formatCurrency } from "@eventkit/lib/utils";
import {
  resetAttendeePassword,
  getAttendeeOtherEvents,
  getAttendeeUserAccount,
  createAttendeeAccount,
} from "./actions";
import { CancelAttendeeDialog } from "./cancel-attendee-dialog";

interface OrderItem {
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ticketType: {
    name: string;
  };
}

interface Order {
  id: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  items: OrderItem[];
}

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  paymentStatus: "pending" | "paid" | "free" | "refunded";
  checkedInAt: Date | null;
  cancelledAt: Date | null;
  amountPaid: number | null;
  createdAt: Date;
  userId?: string | null;
  orders?: Order[];
}

interface OtherEvent {
  eventId: string;
  event: {
    id: string;
    name: string;
    startDate: Date;
  };
  ticketType: {
    name: string;
  };
}

interface UserAccount {
  id: string;
  email: string | undefined;
  createdAt: string;
  lastSignInAt: string | null;
  mustChangePassword: boolean;
  temporaryPassword: string | null;
}

interface AttendeeSheetProps {
  attendee: Attendee;
  ticketTypeName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  free: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
  partially_refunded: "bg-amber-100 text-amber-700",
};

export function AttendeeSheet({
  attendee,
  ticketTypeName,
  open,
  onOpenChange,
  eventId,
}: AttendeeSheetProps) {
  const [resettingPassword, setResettingPassword] = useState(false);
  const [otherEvents, setOtherEvents] = useState<OtherEvent[]>([]);
  const [loadingOtherEvents, setLoadingOtherEvents] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [loadingUserAccount, setLoadingUserAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingUserAccount(true);
      getAttendeeUserAccount({ attendeeId: attendee.id, eventId })
        .then((result) => {
          if (result.success) {
            setUserAccount(result.data as UserAccount | null);
          }
        })
        .finally(() => setLoadingUserAccount(false));

      if (attendee.userId) {
        setLoadingOtherEvents(true);
        getAttendeeOtherEvents({ eventId, userId: attendee.userId })
          .then((result) => {
            if (result.success) {
              setOtherEvents(result.data as OtherEvent[]);
            }
          })
          .finally(() => setLoadingOtherEvents(false));
      }
    }
    if (!open) {
      setUserAccount(null);
      setOtherEvents([]);
      setShowPassword(false);
    }
  }, [open, attendee.id, attendee.userId, eventId]);

  async function refreshUserAccount() {
    setLoadingUserAccount(true);
    const result = await getAttendeeUserAccount({
      attendeeId: attendee.id,
      eventId,
    });
    if (result.success) {
      setUserAccount(result.data as UserAccount | null);
    }
    setLoadingUserAccount(false);
  }

  async function handleResetPassword() {
    setResettingPassword(true);
    const result = await resetAttendeePassword({
      eventId,
      attendeeId: attendee.id,
    });
    setResettingPassword(false);

    if (result.success) {
      toast.success("Password reset successfully");
      setShowPassword(false);
      await refreshUserAccount();
    } else {
      toast.error(result.error);
    }
  }

  async function handleCreateAccount() {
    setCreatingAccount(true);
    const result = await createAttendeeAccount({
      attendeeId: attendee.id,
      eventId,
    });
    setCreatingAccount(false);

    if (result.success) {
      toast.success("User account created successfully");
      await refreshUserAccount();
    } else {
      toast.error(result.error);
    }
  }

  async function handleCopyEmail() {
    const email = userAccount?.email ?? attendee.email;
    await navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  }

  async function handleCopyPassword() {
    if (!userAccount?.temporaryPassword) return;
    await navigator.clipboard.writeText(userAccount.temporaryPassword);
    toast.success("Password copied to clipboard");
  }

  async function handleCopyAllCredentials() {
    if (!userAccount?.temporaryPassword) return;
    const email = userAccount.email ?? attendee.email;
    const text = `Email: ${email}\nTemporary Password: ${userAccount.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    toast.success("Credentials copied to clipboard");
  }

  // Get order for this attendee
  const order = attendee.orders && attendee.orders.length > 0 ? attendee.orders[0] : null;

  const fields = [
    { label: "Email", value: attendee.email },
    { label: "Company", value: attendee.company ?? "-" },
    { label: "Job Title", value: attendee.jobTitle ?? "-" },
    ...(!order && ticketTypeName
      ? [{ label: "Ticket Type", value: ticketTypeName }]
      : []),
    {
      label: "Payment Status",
      value: (
        <Badge
          variant="secondary"
          className={paymentStyles[attendee.paymentStatus]}
        >
          {attendee.paymentStatus}
        </Badge>
      ),
    },
    {
      label: "Checked In",
      value: attendee.checkedInAt
        ? formatDate(attendee.checkedInAt)
        : "Not checked in",
    },
    { label: "Registered", value: formatDate(attendee.createdAt) },
  ];

  function renderOrderBreakdown() {
    if (!order) {
      return (
        <p className="text-sm text-muted-foreground">
          No order associated with this attendee.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-700">
            Order #{order.id.slice(0, 8)}
          </span>
          <Badge
            variant="secondary"
            className={paymentStyles[order.paymentStatus] ?? "bg-stone-100 text-stone-700"}
          >
            {order.paymentStatus === "paid"
              ? "Paid"
              : order.paymentStatus === "free"
                ? "Free"
                : order.paymentStatus}
          </Badge>
        </div>

        <div className="space-y-1.5">
          {order.items.map((item) => (
            <div
              key={item.ticketTypeId}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-stone-600">
                {item.quantity > 1 ? `${item.quantity}× ` : ""}
                {item.ticketType.name}
              </span>
              <span className="font-medium text-stone-900">
                {item.subtotal === 0
                  ? "Free"
                  : formatCurrency(item.subtotal, order.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">Total</span>
            <span className="font-semibold text-stone-900">
              {order.totalAmount === 0
                ? "Free"
                : formatCurrency(order.totalAmount, order.currency)}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-400">
          {order.paymentStatus === "paid"
            ? `Paid via Stripe · ${formatDate(order.createdAt)}`
            : order.paymentStatus === "free"
              ? `Free registration · ${formatDate(order.createdAt)}`
              : formatDate(order.createdAt)}
        </p>

        {order.stripeCheckoutSessionId && (
          <a
            href={`https://dashboard.stripe.com/payments/${order.stripeCheckoutSessionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View in Stripe
          </a>
        )}
      </div>
    );
  }

  function renderLoginCredentials() {
    if (loadingUserAccount) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading account info...
        </div>
      );
    }

    if (!attendee.userId || !userAccount) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No user account linked to this attendee.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateAccount}
            disabled={creatingAccount}
          >
            {creatingAccount ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            )}
            Create Account
          </Button>
        </div>
      );
    }

    if (userAccount.mustChangePassword && userAccount.temporaryPassword) {
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-sm">{userAccount.email ?? attendee.email}</p>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Temporary Password</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="font-mono text-sm">
                {showPassword
                  ? userAccount.temporaryPassword
                  : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              This attendee has not set their own password yet.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCopyAllCredentials}
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy All Credentials
          </Button>
          <ResetPasswordButton
            resetting={resettingPassword}
            onConfirm={handleResetPassword}
          />
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="mt-0.5 text-sm">{userAccount.email ?? attendee.email}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <Check className="h-3.5 w-3.5" />
          Password set by attendee
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last login</p>
          <p className="mt-0.5 text-sm">
            {userAccount.lastSignInAt
              ? formatDate(userAccount.lastSignInAt)
              : "Never logged in"}
          </p>
        </div>
        <ResetPasswordButton
          resetting={resettingPassword}
          onConfirm={handleResetPassword}
        />
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {attendee.firstName} {attendee.lastName}
          </SheetTitle>
          <SheetDescription>Attendee details</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="space-y-4 p-4">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {field.label}
              </p>
              <div className="mt-1 text-sm">{field.value}</div>
            </div>
          ))}
        </div>

        <Separator />
        <div className="space-y-4 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Order Details
          </p>
          {renderOrderBreakdown()}
        </div>

        <Separator />
        <div className="space-y-4 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Login Credentials
          </p>
          {renderLoginCredentials()}
        </div>

        {attendee.userId && (
          <>
            <Separator />
            <div className="space-y-3 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Other Events
              </p>
              {loadingOtherEvents ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading...
                </div>
              ) : otherEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No other events found for this user.
                </p>
              ) : (
                <div className="space-y-2">
                  {otherEvents.map((record) => (
                    <div
                      key={record.eventId}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-sm font-medium">
                        {record.event.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(record.event.startDate)} &middot;{" "}
                        {record.ticketType.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!attendee.cancelledAt && (
          <>
            <Separator />
            <div className="space-y-3 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </p>
              <CancelAttendeeDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                attendeeId={attendee.id}
                attendeeName={`${attendee.firstName} ${attendee.lastName}`}
                eventId={eventId}
                paymentStatus={attendee.paymentStatus}
                amountPaid={attendee.amountPaid ?? 0}
                currency="CAD"
                onSuccess={() => {
                  onOpenChange(false);
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => setCancelDialogOpen(true)}
              >
                <Ban className="mr-1.5 h-3.5 w-3.5" />
                Cancel Registration
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ResetPasswordButton({
  resetting,
  onConfirm,
}: {
  resetting: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" disabled={resetting} />}
      >
        {resetting ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <KeyRound className="mr-1.5 h-3.5 w-3.5" />
        )}
        Reset Password
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            This will generate a new temporary password and invalidate the
            current one. The attendee will need to use the new password to log
            in. Continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Reset Password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

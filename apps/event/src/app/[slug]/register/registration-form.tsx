"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { formatCurrency } from "@eventkit/lib/utils";
import type { CustomField } from "@eventkit/types";
import { registerFree, createCheckout, registerFreeCart, createCartCheckout } from "./actions";
import { TicketCart } from "./ticket-cart";
import { OrderSummary } from "./order-summary";
import { AttendeeDetails } from "./attendee-details";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  soldCount: number;
  salesStart: Date | null;
  salesEnd: Date | null;
  isVisible: boolean;
  allowWaitlist: boolean;
  minPerOrder: number;
  maxPerOrder: number;
}

interface RegistrationFormProps {
  eventId: string;
  eventSlug: string;
  ticketTypes: TicketType[];
  customFields: CustomField[];
  currency: string;
  primaryColor: string;
  secondaryColor: string;
}

export function RegistrationForm({
  eventId,
  eventSlug,
  ticketTypes,
  customFields,
  currency,
  primaryColor,
  secondaryColor,
}: RegistrationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const cartItems = ticketTypes
    .filter((t) => (cart[t.id] ?? 0) > 0)
    .map((t) => ({
      id: t.id,
      name: t.name,
      quantity: cart[t.id]!,
      unitPrice: t.price,
    }));

  const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const allFree = totalAmount === 0 && totalQuantity > 0;

  function handleCartChange(ticketTypeId: string, quantity: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity === 0) {
        delete next[ticketTypeId];
      } else {
        next[ticketTypeId] = quantity;
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (totalQuantity === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    const requiredCustom = customFields.filter((f) => f.required);
    for (const field of requiredCustom) {
      if (!customValues[field.id]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    startTransition(async () => {
      const items = cartItems.map((i) => ({
        ticketTypeId: i.id,
        quantity: i.quantity,
      }));

      const payload = {
        eventId,
        items,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        customFieldValues: customValues,
      };

      if (allFree) {
        const result = await registerFreeCart(payload);
        if (result.success) {
          toast.success("Registration complete!");
          router.push(
            `/${eventSlug}/register/success?qr=${result.data.qrCode}`
          );
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createCartCheckout(payload);
        if (result.success && result.data.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          toast.error(
            result.success ? "Could not create checkout" : result.error
          );
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <TicketCart
        ticketTypes={ticketTypes}
        cart={cart}
        onCartChange={handleCartChange}
        currency={currency}
        primaryColor={secondaryColor}
      />

      {totalQuantity > 0 && (
        <OrderSummary items={cartItems} currency={currency} />
      )}

      <AttendeeDetails
        firstName={firstName}
        lastName={lastName}
        email={email}
        customFields={customFields}
        customValues={customValues}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onEmailChange={setEmail}
        onCustomValueChange={(id, val) =>
          setCustomValues((prev) => ({ ...prev, [id]: val }))
        }
        primaryColor={primaryColor}
      />

      <Button
        type="submit"
        disabled={isPending || totalQuantity === 0}
        className="w-full py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: secondaryColor }}
      >
        {isPending
          ? "Processing..."
          : allFree
            ? "Complete Registration"
            : `Continue to Payment — ${formatCurrency(totalAmount, currency)}`}
      </Button>
    </form>
  );
}

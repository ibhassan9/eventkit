"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CustomField } from "@/types";
import { registerFree, createCheckout } from "./actions";
import { TicketSelector } from "./ticket-selector";
import { AttendeeDetails } from "./attendee-details";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
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
  const [selectedTicketId, setSelectedTicketId] = useState(ticketTypes[0]?.id ?? "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketId);
  const isFree = selectedTicket?.price === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const requiredCustom = customFields.filter((f) => f.required);
    for (const field of requiredCustom) {
      if (!customValues[field.id]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    startTransition(async () => {
      const payload = {
        eventId,
        ticketTypeId: selectedTicketId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        customFieldValues: customValues,
      };

      if (isFree) {
        const result = await registerFree(payload);
        if (result.success) {
          toast.success("Registration complete!");
          router.push(`/${eventSlug}/register/success?qr=${result.data.qrCode}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createCheckout(payload);
        if (result.success && result.data.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          toast.error(result.success ? "Could not create checkout" : result.error);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <TicketSelector
        ticketTypes={ticketTypes}
        selectedId={selectedTicketId}
        onSelect={setSelectedTicketId}
        currency={currency}
        secondaryColor={secondaryColor}
      />

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
        disabled={isPending || !selectedTicketId}
        className="w-full py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: secondaryColor }}
      >
        {isPending
          ? "Processing..."
          : isFree
            ? "Complete Registration"
            : `Pay ${selectedTicket ? formatCurrency(selectedTicket.price, currency) : ""}`}
      </Button>
    </form>
  );
}

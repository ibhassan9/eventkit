"use client";

import { formatCurrency } from "@eventkit/lib/utils";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  currency: string;
}

export function OrderSummary({ items, currency }: OrderSummaryProps) {
  if (items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-sm font-semibold text-zinc-900">Order Summary</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">
              {item.quantity}&times; {item.name}
            </span>
            <span className="font-medium text-zinc-900">
              {item.unitPrice === 0
                ? "Free"
                : formatCurrency(item.unitPrice * item.quantity, currency)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-zinc-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-900">Total</span>
          <span className="text-lg font-semibold text-zinc-900">
            {total === 0 ? "Free" : formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

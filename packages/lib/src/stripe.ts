import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export async function createConnectAccount() {
  const stripe = getStripe();
  return stripe.accounts.create({ type: "standard" });
}

export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
) {
  const stripe = getStripe();
  return stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });
}

export async function getAccountStatus(accountId: string) {
  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(accountId);
  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
  };
}

export async function createCheckoutSession(params: {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
  }>;
  connectedAccountId: string;
  applicationFeeAmount: number;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}) {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    line_items: params.lineItems,
    mode: "payment",
    payment_intent_data: {
      application_fee_amount: params.applicationFeeAmount,
      transfer_data: { destination: params.connectedAccountId },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
}

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number;
  reverseTransfer?: boolean;
  refundApplicationFee?: boolean;
}) {
  const stripe = getStripe();
  return stripe.refunds.create({
    payment_intent: params.paymentIntentId,
    ...(params.amount ? { amount: params.amount } : {}),
    reverse_transfer: params.reverseTransfer ?? true,
    refund_application_fee: params.refundApplicationFee ?? true,
  });
}

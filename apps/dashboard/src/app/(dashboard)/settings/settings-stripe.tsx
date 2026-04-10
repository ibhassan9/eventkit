"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Badge } from "@eventkit/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@eventkit/ui/card";
import { CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import { connectStripe, checkStripeStatus } from "./actions";

interface SettingsStripeProps {
  org: {
    id: string;
    stripeAccountId: string | null;
    stripeOnboardingComplete: boolean;
  };
}

export function SettingsStripe({ org }: SettingsStripeProps) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(org.stripeOnboardingComplete);

  async function handleConnect() {
    setLoading(true);
    const result = await connectStripe({});
    setLoading(false);
    if (result.success && result.data) {
      window.location.href = result.data;
    } else {
      toast.error(result.success ? "Failed to create link" : result.error);
    }
  }

  async function handleCheckStatus() {
    setLoading(true);
    const result = await checkStripeStatus({});
    setLoading(false);
    if (result.success) {
      setConnected(result.data.chargesEnabled);
      if (result.data.chargesEnabled) {
        toast.success("Stripe account is connected and active");
      } else {
        toast.info("Stripe onboarding is not yet complete");
      }
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Stripe Connect
        </CardTitle>
        <CardDescription>
          Connect your Stripe account to accept payments for events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Connected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Your Stripe account is active
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckStatus}
              disabled={loading}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh Status
            </Button>
          </div>
        ) : org.stripeAccountId ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Pending</Badge>
              <span className="text-sm text-muted-foreground">
                Complete your Stripe onboarding
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckStatus}
                disabled={loading}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Check Status
              </Button>
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={loading}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Continue Setup
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Stripe Account"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

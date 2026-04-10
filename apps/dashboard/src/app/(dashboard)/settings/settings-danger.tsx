"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@eventkit/ui/card";
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
import { Trash2 } from "lucide-react";
import { deleteOrg } from "./actions";

interface SettingsDangerProps {
  orgId: string;
  orgName: string;
}

export function SettingsDanger({ orgId, orgName }: SettingsDangerProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteOrg({ id: orgId });
    setDeleting(false);
    if (result.success) {
      toast.success("Organization deleted");
      router.push("/onboarding");
    } else {
      toast.error(result.error);
    }
  }

  const canDelete = confirmText === orgName;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your organization and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete Organization
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete organization?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All events, attendees, and data
                will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 px-0">
              <Label htmlFor="confirm-delete" className="text-sm">
                Type <span className="font-mono font-bold">{orgName}</span> to
                confirm
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={orgName}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={!canDelete || deleting}
                onClick={handleDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Delete Forever"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

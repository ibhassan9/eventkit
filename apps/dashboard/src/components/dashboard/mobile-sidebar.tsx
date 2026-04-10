"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@eventkit/ui/sheet";
import { SidebarNav } from "./sidebar-nav";

interface MobileSidebarProps {
  orgName: string;
  orgLogoUrl: string | null;
}

export function MobileSidebar({ orgName, orgLogoUrl }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden">
      <div className="flex items-center gap-3">
        {orgLogoUrl ? (
          <img
            src={orgLogoUrl}
            alt={orgName}
            className="h-7 w-7 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-600">
            {orgName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="truncate text-sm font-semibold text-stone-900">
          {orgName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "h-7 w-7" },
          }}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="text-stone-700">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 bg-white p-0">
            <SheetHeader className="border-b border-stone-200 px-6 py-4">
              <SheetTitle className="text-stone-900">Navigation</SheetTitle>
            </SheetHeader>
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

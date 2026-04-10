"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { CalendarDays, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";

interface MobileSidebarProps {
  orgName: string;
  orgLogoUrl: string | null;
}

export function MobileSidebar({ orgName, orgLogoUrl }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-14 items-center justify-between border-b bg-zinc-950 px-4 md:hidden">
      <div className="flex items-center gap-3">
        {orgLogoUrl ? (
          <img
            src={orgLogoUrl}
            alt={orgName}
            className="h-7 w-7 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="truncate text-sm font-semibold text-white">
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
              <Button variant="ghost" size="icon-sm" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 bg-zinc-950 p-0">
            <SheetHeader className="border-b border-white/10 px-6 py-4">
              <SheetTitle className="text-white">Navigation</SheetTitle>
            </SheetHeader>
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

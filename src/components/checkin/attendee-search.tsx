"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AttendeeCard } from "./attendee-card";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  ticketType?: { name: string } | null;
  checkedInAt: string | null;
}

interface AttendeeSearchProps {
  onSearch: (query: string) => Promise<{
    success: boolean;
    data?: Attendee[];
    error?: string;
  }>;
  onCheckIn: (
    attendeeId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function AttendeeSearch({ onSearch, onCheckIn }: AttendeeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Attendee[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const result = await onSearch(term);
      if (result.success && result.data) {
        setResults(result.data);
      }
      setIsSearching(false);
    },
    [onSearch]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-14 pl-12 text-lg"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {query.length >= 2 && results.length === 0 && !isSearching && (
        <p className="py-8 text-center text-lg text-muted-foreground">
          No attendees found for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-3">
        {results.map((attendee) => (
          <AttendeeCard
            key={attendee.id}
            attendee={attendee}
            onCheckIn={onCheckIn}
          />
        ))}
      </div>
    </div>
  );
}

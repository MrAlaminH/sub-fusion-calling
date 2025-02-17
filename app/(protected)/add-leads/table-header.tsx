"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { TableHeaderProps } from "./types";
import { FIELD_MAPPINGS } from "./constants";
import { cn } from "@/lib/utils";

export function LeadTableHeader({
  onSelectAll,
  allSelected,
  sortState,
  onSort,
  hasLeads,
}: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
        <TableHead className="w-[50px] p-4">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            disabled={!hasLeads}
            aria-label="Select all leads"
          />
        </TableHead>
        {Object.entries(FIELD_MAPPINGS).map(([key, label]) => (
          <TableHead
            key={key}
            className={cn(
              "h-11 px-4 py-3 text-left align-middle font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer select-none whitespace-nowrap",
              sortState.column === key && "bg-muted/70 text-foreground"
            )}
            onClick={() => onSort(key as keyof typeof FIELD_MAPPINGS)}
            role="columnheader"
            aria-sort={
              sortState.column === key
                ? sortState.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
            }
          >
            <div className="flex items-center gap-2">
              <span>{label}</span>
              {sortState.column === key ? (
                <span className="inline-flex">
                  {sortState.direction === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </span>
              ) : (
                <span className="invisible inline-flex">
                  <ArrowUp className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

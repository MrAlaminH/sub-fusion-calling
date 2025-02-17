"use client";

import { useCallback } from "react";
import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { TableBodyProps } from "./types";
import { FIELD_MAPPINGS, type DisplayableFields } from "./constants";
import { CellRenderer } from "./cell-renderer";
import { TableSkeleton } from "./table-skeleton";
import { cn } from "@/lib/utils";

export function LeadTableBody({
  leads,
  selectedLeads,
  editingCell,
  onToggleLead,
  onEdit,
  onStartEdit,
  onKeyDown,
  setEditingCell,
  isLoading,
}: TableBodyProps) {
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      id: string,
      field: DisplayableFields,
      value: string
    ) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onStartEdit(null, null);
        return;
      }

      // Let the parent component handle all other key navigation
      onKeyDown(e, id, field, value);
    },
    [onKeyDown, onStartEdit]
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (leads.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={Object.keys(FIELD_MAPPINGS).length + 1}
            className="h-32 text-center"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                No leads available
              </p>
              <p className="text-sm text-muted-foreground">
                Add a new lead or import from CSV
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {leads.map((lead) => (
        <TableRow
          key={lead.id}
          className={cn(
            "border-b transition-colors hover:bg-muted/30",
            selectedLeads.includes(lead.id) && "bg-muted/50"
          )}
          data-selected={selectedLeads.includes(lead.id)}
        >
          <TableCell className="w-[50px] p-4">
            <Checkbox
              checked={selectedLeads.includes(lead.id)}
              onCheckedChange={() => onToggleLead(lead.id)}
              aria-label={`Select ${lead.name}`}
            />
          </TableCell>
          {(Object.keys(FIELD_MAPPINGS) as Array<DisplayableFields>).map(
            (field): ReactNode => {
              return (
                <TableCell key={field} className="p-0">
                  <div className="px-4 py-3 min-h-[2.75rem] flex items-center">
                    <CellRenderer
                      key={field}
                      lead={lead}
                      field={field}
                      editingCell={editingCell}
                      onEdit={onEdit}
                      onStartEdit={onStartEdit}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          lead.id,
                          field,
                          String(lead[field] ?? "")
                        )
                      }
                      setEditingCell={setEditingCell}
                    />
                  </div>
                </TableCell>
              );
            }
          )}
        </TableRow>
      ))}
    </TableBody>
  );
}

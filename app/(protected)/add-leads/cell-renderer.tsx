"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import type { Lead } from "./types";
import {
  STATUS_STYLES,
  NON_EDITABLE_FIELDS,
  STATUS_OPTIONS,
  type DisplayableFields,
} from "./constants";
import type { EditingCell } from "./types";
import { cn } from "@/lib/utils";

interface CellRendererProps {
  lead: Lead;
  field: DisplayableFields;
  editingCell: EditingCell | null;
  onEdit: (
    id: string,
    field: DisplayableFields,
    value: string
  ) => Promise<void>;
  onStartEdit: (id: string, field: DisplayableFields) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: DisplayableFields,
    value: string
  ) => void;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCell | null>>;
}

export function CellRenderer({
  lead,
  field,
  editingCell,
  onEdit,
  onStartEdit,
  onKeyDown,
  setEditingCell,
}: CellRendererProps) {
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell?.id === lead.id && editingCell?.field === field) {
      setEditValue(String(lead[field] || ""));
      // Add a small delay to ensure the input is rendered before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editingCell, lead, field]);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onKeyDown(e, lead.id, field, editValue);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        // First save the value
        await onEdit(lead.id, field, editValue);
        // Only trigger navigation on Tab
        if (e.key === "Tab") {
          onKeyDown(e, lead.id, field, editValue);
        } else {
          // For Enter, just exit edit mode
          setEditingCell(null);
        }
      }
    },
    [editValue, field, lead.id, onEdit, onKeyDown, setEditingCell]
  );

  const handleBlur = useCallback(async () => {
    // Only save on blur if the value has changed
    if (editValue !== String(lead[field] || "")) {
      await onEdit(lead.id, field, editValue);
    }
    setEditingCell(null);
  }, [editValue, field, lead, onEdit, setEditingCell]);

  if (
    editingCell?.id === lead.id &&
    editingCell?.field === field &&
    !NON_EDITABLE_FIELDS.includes(field)
  ) {
    if (field === "status") {
      return (
        <Select
          value={editValue}
          onValueChange={async (value) => {
            await onEdit(lead.id, field, value);
            setEditingCell(null);
          }}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCell(null);
            }
          }}
        >
          <SelectTrigger
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setEditingCell(null);
              } else if (e.key === "Tab") {
                onKeyDown(
                  e as unknown as React.KeyboardEvent<HTMLInputElement>,
                  lead.id,
                  field,
                  editValue
                );
              }
            }}
            className="h-8 w-[140px]"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="h-8 w-full"
      />
    );
  }

  const value = lead[field];

  if (field === "status" && typeof value === "string") {
    return (
      <Badge
        className={`${
          STATUS_STYLES[value as Lead["status"]]
        } cursor-pointer text-xs font-medium`}
        onClick={() => onStartEdit(lead.id, field)}
      >
        {STATUS_OPTIONS.find((option) => option.value === value)?.label ??
          value}
      </Badge>
    );
  }

  if (field === "created_at" || field === "updated_at") {
    return (
      <span className="text-sm text-muted-foreground">
        {value ? formatDateTime(value as string) : "Never"}
      </span>
    );
  }

  if (field === "email") {
    return (
      <span
        className={cn(
          "text-sm text-primary hover:underline cursor-pointer",
          NON_EDITABLE_FIELDS.includes(field) ? "" : "cursor-text"
        )}
        onClick={() =>
          !NON_EDITABLE_FIELDS.includes(field) && onStartEdit(lead.id, field)
        }
      >
        {String(value ?? "")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-sm",
        NON_EDITABLE_FIELDS.includes(field)
          ? "text-muted-foreground"
          : "cursor-text"
      )}
      onClick={() =>
        !NON_EDITABLE_FIELDS.includes(field) && onStartEdit(lead.id, field)
      }
    >
      {String(value ?? "")}
    </span>
  );
}

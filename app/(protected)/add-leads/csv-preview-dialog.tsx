"use client";

import { useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CSVDialogProps } from "./types";
import { FIELD_MAPPINGS } from "./constants";

const CSV_PREVIEW_FIELDS = ["name", "email", "phone", "company"] as const;

export function CSVPreviewDialog({
  previewData,
  onConfirm,
  onCancel,
  open,
}: CSVDialogProps) {
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        onCancel();
      }
    },
    [onCancel]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(previewData);
  }, [onConfirm, previewData]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm CSV Import</AlertDialogTitle>
          <AlertDialogDescription>
            Please review the data before importing. The following{" "}
            {previewData.length} lead{previewData.length === 1 ? "" : "s"} will
            be added:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="h-[50vh] my-4 rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {CSV_PREVIEW_FIELDS.map((field) => (
                  <TableHead key={field}>{FIELD_MAPPINGS[field]}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={`${row.name}-${row.email}-${index}`}>
                  {CSV_PREVIEW_FIELDS.map((field) => (
                    <TableCell key={field}>{row[field] || ""}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Import</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

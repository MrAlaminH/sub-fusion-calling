"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Table } from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Import our components and hooks
import { CSVPreviewDialog } from "./csv-preview-dialog";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadTableHeader } from "./table-header";
import { LeadTableBody } from "./table-body";
import { Pagination } from "./pagination";
import { useLeadSort } from "./hooks/use-lead-sort";
import { useCSVImport } from "./hooks/use-csv-import";
import { usePageSize } from "./hooks/use-page-size";

// Import types and constants
import type { Lead, EditingCell, LeadFormState } from "./types";
import {
  STATUS_OPTIONS,
  FIELD_MAPPINGS,
  NON_EDITABLE_FIELDS,
  type DisplayableFields,
} from "./constants";

interface LeadTableProps {
  initialLeads: Lead[];
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  deleteLeads: (ids: string[]) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (ids: string[], status: Lead["status"]) => Promise<void>;
  getLeads: (params: {
    sortBy?: { column: keyof Lead; ascending: boolean } | undefined;
    page?: number;
    pageSize?: number;
  }) => Promise<{
    data: Lead[];
    count: number;
  }>;
}

export function LeadTable({
  initialLeads,
  updateLead,
  deleteLeads,
  createLead,
  updateLeadStatus,
  getLeads,
}: LeadTableProps) {
  const [rawLeads, setRawLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(initialLeads.length);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize our custom hooks
  const { sortState, handleSort, getSortedLeads } = useLeadSort();
  const sortedLeads = getSortedLeads(rawLeads);
  const {
    csvPreviewData,
    showCSVPreview,
    fileInputRef,
    handleFileUpload,
    handleCSVImport,
    setShowCSVPreview,
  } = useCSVImport(async (data) => {
    try {
      // Create leads in sequence to avoid overwhelming the database
      for (const lead of data) {
        await createLead({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company || null,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Refresh the leads list
      await fetchLeads(false);

      toast({
        title: "Success",
        description: `Successfully imported ${data.length} lead${
          data.length === 1 ? "" : "s"
        }.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error importing leads:", error);
      toast({
        title: "Error importing leads",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });
  const { pageSize, setPageSize } = usePageSize();

  const fetchLeads = useCallback(
    async (showSuccessToast = false) => {
      try {
        setIsLoading(true);
        const { data, count } = await getLeads({
          sortBy: sortState.column
            ? {
                column: sortState.column,
                ascending: sortState.direction === "asc",
              }
            : undefined,
          page: currentPage,
          pageSize,
        });

        if (data) {
          setRawLeads(data);
          setTotalRecords(count);

          if (showSuccessToast) {
            toast({
              title: "Success",
              description: "Leads refreshed successfully",
              variant: "default",
            });
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentPage,
      getLeads,
      pageSize,
      sortState.column,
      sortState.direction,
      toast,
    ]
  );

  // Fetch leads when pagination or sorting changes
  useEffect(() => {
    fetchLeads(false);
  }, [fetchLeads]);

  const handleUpdateLead = useCallback(
    async (id: string, updates: Partial<Lead>) => {
      try {
        // Optimistically update the UI
        const now = new Date().toISOString();
        setRawLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  ...updates,
                  updated_at: now,
                }
              : lead
          )
        );

        const success = await updateLead(id, updates);
        if (!success) {
          // Revert the optimistic update if the API call fails
          await fetchLeads(false);
          toast({
            title: "Error",
            description: "Failed to update lead. Please try again.",
            variant: "destructive",
          });
          return false;
        }

        return true;
      } catch (error) {
        // Revert the optimistic update if there's an error
        await fetchLeads(false);
        toast({
          title: "Error updating lead",
          description:
            error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchLeads, toast, updateLead]
  );

  const handleDeleteLeads = useCallback(async () => {
    try {
      // Optimistically update the UI
      setRawLeads((prevLeads) =>
        prevLeads.filter((lead) => !selectedLeads.includes(lead.id))
      );

      await deleteLeads(selectedLeads);
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedLeads.length} lead${
          selectedLeads.length === 1 ? "" : "s"
        }.`,
        variant: "default",
      });

      setIsDeleteDialogOpen(false);
      setSelectedLeads([]);
    } catch (err) {
      // Revert the optimistic update if there's an error
      await fetchLeads(false);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to delete leads. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteLeads, fetchLeads, selectedLeads, toast]);

  const handleAddLead = useCallback(
    async (data: LeadFormState) => {
      try {
        await createLead({
          ...data,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "Success",
          description: "Lead created successfully.",
          variant: "default",
        });

        await fetchLeads(false);
        setIsAddingLead(false);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create lead. Please try again.",
          variant: "destructive",
        });
      }
    },
    [createLead, fetchLeads, toast]
  );

  const handleBulkStatusUpdate = useCallback(
    async (status: Lead["status"]) => {
      try {
        // Optimistically update the UI
        const now = new Date().toISOString();
        setRawLeads((prevLeads) =>
          prevLeads.map((lead) =>
            selectedLeads.includes(lead.id)
              ? {
                  ...lead,
                  status,
                  updated_at: now,
                }
              : lead
          )
        );

        await updateLeadStatus(selectedLeads, status);
        toast({
          title: "Success",
          description: `Successfully updated ${selectedLeads.length} lead${
            selectedLeads.length === 1 ? "" : "s"
          } to ${
            STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status
          }.`,
          variant: "default",
        });

        setSelectedLeads([]);
      } catch (err) {
        // Revert the optimistic update if there's an error
        await fetchLeads(false);
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Failed to update leads. Please try again.",
          variant: "destructive",
        });
      }
    },
    [fetchLeads, selectedLeads, toast, updateLeadStatus]
  );

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: keyof Lead,
    value: string
  ) => {
    if (e.key === "Escape") {
      setEditingCell(null);
      return;
    }

    if (e.key === "Enter") {
      try {
        const success = await handleUpdateLead(id, { [field]: value });
        if (success) {
          setEditingCell(null);
        }
      } catch (error) {
        toast({
          title: "Error updating lead",
          description:
            error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      try {
        // Calculate next cell position
        const editableFields = (
          Object.keys(FIELD_MAPPINGS) as Array<keyof Lead>
        ).filter((f) => !NON_EDITABLE_FIELDS.includes(f as DisplayableFields));
        const currentLeadIndex = sortedLeads.findIndex((l) => l.id === id);
        const currentFieldIndex = editableFields.indexOf(field);
        const nextFieldIndex = e.shiftKey
          ? currentFieldIndex - 1
          : currentFieldIndex + 1;

        let nextCell: EditingCell | null = null;

        if (e.shiftKey) {
          // Going backwards
          if (nextFieldIndex >= 0) {
            // Move to previous field in same row
            nextCell = {
              id,
              field: editableFields[nextFieldIndex],
            };
          } else if (currentLeadIndex > 0) {
            // Move to last field of previous row
            nextCell = {
              id: sortedLeads[currentLeadIndex - 1].id,
              field: editableFields[editableFields.length - 1],
            };
          }
        } else {
          // Going forwards
          if (nextFieldIndex < editableFields.length) {
            // Move to next field in same row
            nextCell = {
              id,
              field: editableFields[nextFieldIndex],
            };
          } else if (currentLeadIndex < sortedLeads.length - 1) {
            // Move to first field of next row
            nextCell = {
              id: sortedLeads[currentLeadIndex + 1].id,
              field: editableFields[0],
            };
          }
        }

        // If we have a next cell, move to it
        if (nextCell) {
          // Use requestAnimationFrame to ensure DOM updates are complete
          requestAnimationFrame(() => {
            setEditingCell(nextCell);
          });
        }
      } catch (error) {
        toast({
          title: "Error updating lead",
          description:
            error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => fetchLeads(true)}
              aria-label="Refresh leads"
              className="h-9"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button onClick={() => setIsAddingLead(true)} className="h-9">
              Add Lead
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="h-9"
            >
              Import CSV
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
          {selectedLeads.length > 0 && (
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="destructive" className="h-9">
                    {selectedLeads.length === 1 ? "Actions" : "Bulk Actions"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => handleBulkStatusUpdate(value)}
                      className="cursor-pointer"
                    >
                      Set to {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 cursor-pointer"
                  >
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 overflow-hidden flex flex-col">
        <div className="flex-1 rounded-md border bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <Table>
              <LeadTableHeader
                onSelectAll={(checked) =>
                  setSelectedLeads(
                    checked ? sortedLeads.map((lead) => lead.id) : []
                  )
                }
                allSelected={
                  sortedLeads.length > 0 &&
                  sortedLeads.every((lead) => selectedLeads.includes(lead.id))
                }
                sortState={sortState}
                onSort={handleSort}
                hasLeads={sortedLeads.length > 0}
              />
              <LeadTableBody
                leads={sortedLeads}
                selectedLeads={selectedLeads}
                editingCell={editingCell}
                onToggleLead={(id) => {
                  setSelectedLeads((prev) =>
                    prev.includes(id)
                      ? prev.filter((leadId) => leadId !== id)
                      : [...prev, id]
                  );
                }}
                onEdit={async (id, field, value) => {
                  const success = await handleUpdateLead(id, {
                    [field]: value,
                  });
                  if (!success) {
                    throw new Error("Failed to update lead");
                  }
                }}
                onStartEdit={(id, field) => {
                  if (id && field) {
                    setEditingCell({ id, field });
                  } else {
                    setEditingCell(null);
                  }
                }}
                onKeyDown={handleKeyDown}
                setEditingCell={setEditingCell}
                isLoading={isLoading}
              />
            </Table>
          </div>

          <div className="flex-none border-t bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing 1 to 10 of {totalRecords} results
              </p>
              <div className="flex items-center gap-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalRecords / pageSize)}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
                {selectedLeads.length > 0 && (
                  <div className="ml-4 flex items-center gap-4 text-sm">
                    <span className="font-medium text-muted-foreground">
                      {selectedLeads.length} record
                      {selectedLeads.length === 1 ? "" : "s"} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLeads([])}
                    >
                      Clear selection
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadFormDialog
        open={isAddingLead}
        onOpenChange={setIsAddingLead}
        onSubmit={handleAddLead}
      />

      <CSVPreviewDialog
        previewData={csvPreviewData}
        onConfirm={handleCSVImport}
        onCancel={() => setShowCSVPreview(false)}
        open={showCSVPreview}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedLeads.length} selected lead
              {selectedLeads.length === 1 ? "" : "s"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLeads}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

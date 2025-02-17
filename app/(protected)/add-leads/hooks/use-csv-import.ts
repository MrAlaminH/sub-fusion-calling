'use client';

import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CSVPreviewData } from "../types";

interface CSVColumn {
  index: number;
  name: string;
  required: boolean;
  aliases: string[];
}

const CSV_COLUMNS: CSVColumn[] = [
  {
    index: -1,
    name: "name",
    required: true,
    aliases: ["name", "contact name", "contact_name", "full name", "full_name"],
  },
  {
    index: -1,
    name: "company",
    required: false,
    aliases: ["company", "company name", "company_name", "business", "organization"],
  },
  {
    index: -1,
    name: "phone",
    required: true,
    aliases: ["phone", "tel", "telephone", "phone number", "phone_number"],
  },
  {
    index: -1,
    name: "email",
    required: true,
    aliases: ["email", "mail", "e-mail", "email address", "email_address"],
  },
];

export function useCSVImport(onLeadsUpdate: (data: CSVPreviewData[]) => Promise<void>) {
  const [csvPreviewData, setCSVPreviewData] = useState<CSVPreviewData[]>([]);
  const [showCSVPreview, setShowCSVPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text
          .split(/\r?\n/)
          .filter((row) => row.trim().length > 0);

        if (rows.length < 2) {
          throw new Error("CSV file must contain headers and at least one row");
        }

        // Process headers
        const headers = rows[0]
          .split(",")
          .map((header) =>
            header
              .trim()
              .toLowerCase()
              .replace(/['"]/g, "") // Remove quotes
              .replace(/\s+/g, "_") // Replace spaces with underscore
          );

        // Find column indices
        CSV_COLUMNS.forEach(column => {
          column.index = headers.findIndex(h => 
            column.aliases.some(alias => h.includes(alias))
          );
        });

        // Check required columns
        const missingColumns = CSV_COLUMNS
          .filter(col => col.required && col.index === -1)
          .map(col => col.name);

        if (missingColumns.length > 0) {
          throw new Error(
            `Could not find required columns: ${missingColumns.join(", ")}`
          );
        }

        // Parse data rows
        const parsedData: CSVPreviewData[] = rows
          .slice(1)
          .map((row) => {
            // Handle both quoted and unquoted values
            const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const cleanValues = values.map((val) =>
              val.replace(/^"|"$/g, "").trim()
            );

            const rowData: Partial<CSVPreviewData> = {};

            CSV_COLUMNS.forEach(column => {
              if (column.index !== -1) {
                const value = cleanValues[column.index] || "";
                if (value) {
                  rowData[column.name as keyof CSVPreviewData] = value;
                }
              }
            });

            return rowData as CSVPreviewData;
          })
          .filter((row) => {
            // Validate required fields
            return CSV_COLUMNS
              .filter(col => col.required)
              .every(col => row[col.name as keyof CSVPreviewData]);
          });

        if (parsedData.length === 0) {
          throw new Error("No valid data rows found in CSV");
        }

        setCSVPreviewData(parsedData);
        setShowCSVPreview(true);
      } catch (error) {
        toast({
          title: "Error parsing CSV",
          description:
            error instanceof Error ? error.message : "Invalid CSV format",
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the CSV file",
        variant: "destructive",
      });
    };

    reader.readAsText(file);

    // Reset the file input
    if (event.target) {
      event.target.value = "";
    }
  }, [toast]);

  const handleCSVImport = useCallback(async (data: CSVPreviewData[]) => {
    try {
      await onLeadsUpdate(data);
      
      toast({
        title: "CSV imported",
        description: `${data.length} lead(s) have been imported successfully.`,
        variant: "default",
      });

      setShowCSVPreview(false);
      setCSVPreviewData([]);
    } catch (error) {
      toast({
        title: "Error importing leads",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }, [onLeadsUpdate, toast]);

  return {
    csvPreviewData,
    showCSVPreview,
    fileInputRef,
    handleFileUpload,
    handleCSVImport,
    setShowCSVPreview,
  } as const;
}

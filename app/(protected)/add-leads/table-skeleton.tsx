"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FIELD_MAPPINGS } from "./constants";

export function TableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-b">
          <TableCell className="w-[50px] p-4">
            <Skeleton className="h-4 w-4" />
          </TableCell>
          {Object.keys(FIELD_MAPPINGS).map((field) => (
            <TableCell key={field} className="p-0">
              <div className="px-4 py-3 min-h-[2.75rem] flex items-center">
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

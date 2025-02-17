"use client";

import { useState } from "react";
import { LeadTable } from "./index";
import type { Lead } from "./types";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../components/page-header";
import { mutate } from "swr";

// Helper function to revalidate leads cache
const revalidateLeadsCache = () =>
  mutate<unknown>((key: string) => key.startsWith("/api/leads"));

export default function LeadTablePage() {
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const [isTogglingCall, setIsTogglingCall] = useState(false);

  const handleAutoCallingToggle = async (enabled: boolean) => {
    try {
      setIsTogglingCall(true);
      const webhookUrl = enabled
        ? process.env.NEXT_PUBLIC_N8N_START_CALLING_WEBHOOK
        : process.env.NEXT_PUBLIC_N8N_STOP_CALLING_WEBHOOK;

      if (!webhookUrl) {
        throw new Error("Webhook URL not configured");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: enabled ? "start" : "stop",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle auto-calling");
      }

      setIsAutoCalling(enabled);
    } catch (error) {
      console.error("Error toggling auto-calling:", error);
      // Revert the toggle if there was an error
      setIsAutoCalling(!enabled);
    } finally {
      setIsTogglingCall(false);
    }
  };

  const api = {
    getLeads: async ({
      sortBy,
      page = 1,
      pageSize = 10,
    }: {
      sortBy?: { column: keyof Lead; ascending: boolean };
      page?: number;
      pageSize?: number;
    }) => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(sortBy && {
          sortColumn: sortBy.column,
          sortDirection: sortBy.ascending ? "asc" : "desc",
        }),
      });

      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      return response.json();
    },

    createLead: async (data: Partial<Lead>) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      // Revalidate all leads queries
      await revalidateLeadsCache();
      return response.json();
    },

    updateLead: async (id: string, updates: Partial<Lead>) => {
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      // Revalidate all leads queries
      if (response.ok) {
        await revalidateLeadsCache();
      }

      return response.ok;
    },

    deleteLeads: async (ids: string[]) => {
      const response = await fetch(`/api/leads?ids=${ids.join(",")}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete leads");
      }

      // Revalidate all leads queries
      await revalidateLeadsCache();
    },

    updateLeadStatus: async (ids: string[], status: Lead["status"]) => {
      const updatePromises = ids.map((id) =>
        fetch("/api/leads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        })
      );

      await Promise.all(updatePromises);
      // Revalidate all leads queries
      await revalidateLeadsCache();
    },
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b bg-background">
        <PageHeader title="Leads">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-calling"
              checked={isAutoCalling}
              onCheckedChange={handleAutoCallingToggle}
              disabled={isTogglingCall}
            />
            <label
              htmlFor="auto-calling"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto Calling
            </label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Auto calling info</span>
                  <InfoCircledIcon className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Auto Calling Feature
                  </h4>
                  <p className="text-sm">
                    When enabled, the system will automatically start calling
                    leads based on their priority and status.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </PageHeader>
      </div>

      <main className="flex-1 overflow-hidden">
        <LeadTable
          initialLeads={[]}
          getLeads={api.getLeads}
          createLead={api.createLead}
          updateLead={api.updateLead}
          deleteLeads={api.deleteLeads}
          updateLeadStatus={api.updateLeadStatus}
        />
      </main>
    </div>
  );
}

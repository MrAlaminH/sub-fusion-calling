"use client";

import React from "react";
import CalendarView from "./components/CalendarView";
import { Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PageHeader } from "../components/page-header";

export default function CalendarPage() {
  return (
    <div className="flex min-h-full w-full flex-col">
      <PageHeader title="Calendar" />

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "sticky top-0 z-40 w-full",
            "bg-white/80 backdrop-blur-md shadow-sm",
            "border-b border-gray-200/80"
          )}
        >
          <div className="flex h-16 w-full items-center justify-between px-6 lg:px-8 transition-all">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
              </SidebarTrigger>

              <div className="flex flex-col">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-2xl"
                >
                  Calendar
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden text-sm text-gray-500 sm:block"
                >
                  Schedule and manage your AI calls
                </motion.div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="h-full p-6">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}

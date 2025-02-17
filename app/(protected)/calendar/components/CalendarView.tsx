"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Info, X } from "lucide-react";

interface CalendarEmbedConfig {
  url: string;
  name: string;
}

const STORAGE_KEY = "mistral-call-embedded-calendars";

// Custom hook for persistent calendar storage
function usePersistedCalendars() {
  const [calendars, setCalendars] = useState<CalendarEmbedConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load calendars from storage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCalendars(parsedData);
        console.log("Loaded calendars from storage:", parsedData);
      }
    } catch (error) {
      console.error("Error loading calendars from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save calendars to storage
  const saveCalendars = useCallback((newCalendars: CalendarEmbedConfig[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalendars));
      setCalendars(newCalendars);
      console.log("Saved calendars to storage:", newCalendars);
    } catch (error) {
      console.error("Error saving calendars to storage:", error);
    }
  }, []);

  return { calendars, saveCalendars, isLoading };
}

export default function CalendarView() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const { calendars, saveCalendars, isLoading } = usePersistedCalendars();

  const handleAddCalendar = () => {
    if (!calendarName || !embedUrl) return;

    // Clean up the URL to ensure it works properly
    let cleanUrl = embedUrl;
    if (embedUrl.includes("&amp;")) {
      cleanUrl = embedUrl.replace(/&amp;/g, "&");
    }

    const newCalendars = [...calendars, { name: calendarName, url: cleanUrl }];
    saveCalendars(newCalendars);
    setCalendarName("");
    setEmbedUrl("");
    setShowAddMenu(false);
  };

  const handleRemoveCalendar = (index: number) => {
    const newCalendars = calendars.filter((_, i) => i !== index);
    saveCalendars(newCalendars);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading calendars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <button
            onClick={() => setShowAddMenu(true)}
            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Add Custom Menu
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 bg-white rounded-lg shadow">
        {calendars.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No calendars added yet</p>
              <button
                onClick={() => setShowAddMenu(true)}
                className="mt-4 px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Add Calendar
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 gap-4">
            {calendars.map((calendar, index) => (
              <div key={index} className="relative h-[600px]">
                <button
                  onClick={() => handleRemoveCalendar(index)}
                  className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Remove calendar"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <iframe
                  src={calendar.url}
                  style={{ border: "1px solid #ddd" }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  title={calendar.name}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Calendar Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Custom Menu</h2>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                title="Show instructions"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {showInstructions && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-2">
                  How to get Google Calendar embed URL:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Go to your Google Calendar settings</li>
                  <li>
                    Under &quot;Settings for my calendars&quot;, select your
                    calendar
                  </li>
                  <li>Scroll to &quot;Integrate calendar&quot; section</li>
                  <li>Make sure your calendar is public or properly shared</li>
                  <li>Copy the entire iframe code provided</li>
                  <li>
                    Paste it here - the URL will be automatically extracted
                  </li>
                </ol>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar Name
                </label>
                <input
                  type="text"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter calendar name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Calendar Embed Code
                </label>
                <textarea
                  value={embedUrl}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Extract URL from iframe if full iframe code is pasted
                    if (value.includes("<iframe")) {
                      const match = value.match(/src="([^"]+)"/);
                      if (match && match[1]) {
                        setEmbedUrl(match[1]);
                        return;
                      }
                    }
                    setEmbedUrl(value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  placeholder="Paste your Google Calendar embed code or URL here"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddMenu(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCalendar}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

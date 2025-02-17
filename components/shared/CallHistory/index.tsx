"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Download,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";
import { PaginationControls } from "./PaginationControls";
import { CallDetailsSlideOver } from "./CallDetailsSlideOver";
import {
  CallRecord,
  CallHistoryProps,
  AudioPlayerState,
  SortConfig,
} from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CallHistory({
  calls: initialCalls,
  showGrade = true,
  showStatus = true,
  onCallClick,
  customActions,
}: CallHistoryProps) {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentUrl: null,
    audio: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortConfig>({
    field: "date",
    direction: "desc",
  });
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredCalls = useMemo(() => {
    return initialCalls.filter((call) => {
      const searchString = searchTerm.toLowerCase();
      return (
        call.customerName.toLowerCase().includes(searchString) ||
        call.customerEmail.toLowerCase().includes(searchString) ||
        call.customerNumber.includes(searchString) ||
        call.summary.toLowerCase().includes(searchString)
      );
    });
  }, [initialCalls, searchTerm]);

  const sortedCalls = useMemo(() => {
    return [...filteredCalls].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      const direction = sort.direction === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction * aValue.localeCompare(bValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction * (aValue - bValue);
      }
      return 0;
    });
  }, [filteredCalls, sort]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return sortedCalls.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, sortedCalls]);

  const totalPages = Math.ceil(sortedCalls.length / pageSize);

  const handlePlayPause = useCallback(
    (url: string) => {
      if (!url) return;

      if (audioState.currentUrl === url) {
        if (audioState.isPlaying) {
          audioState.audio?.pause();
          setAudioState({ ...audioState, isPlaying: false });
        } else {
          audioState.audio?.play();
          setAudioState({ ...audioState, isPlaying: true });
        }
      } else {
        audioState.audio?.pause();
        const newAudio = new Audio(url);
        newAudio.addEventListener("ended", () => {
          setAudioState((prev) => ({ ...prev, isPlaying: false }));
        });
        newAudio.play();
        setAudioState({
          isPlaying: true,
          currentUrl: url,
          audio: newAudio,
        });
      }
    },
    [audioState]
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "in progress":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "failed":
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const getGradeColor = (grade: boolean | null) => {
    switch (grade) {
      case true:
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case false:
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/20";
    }
  };

  const handleSort = (field: keyof CallRecord) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const truncateText = (text: string, length: number) => {
    const words = text.split(" ");
    if (words.length <= length) return text;
    return words.slice(0, length).join(" ") + "...";
  };

  const isNewCall = (date: string) => {
    const callDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - callDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const downloadAudio = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (!initialCalls.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <Phone className="mx-auto h-14 w-14 text-gray-400 animate-bounce" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No calls found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by making your first AI call.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b gap-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-80 group">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
            <Input
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-10 focus-visible:ring-2 transition-all border-gray-200 hover:border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {customActions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 hover:bg-gray-50 transition-colors rounded-lg border-gray-200 hover:border-gray-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-sm font-medium px-3 py-2">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleSort("date")}
                className="flex items-center cursor-pointer hover:bg-gray-50 transition-colors px-3 py-2"
              >
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="flex-1">Date</span>
                {sort.field === "date" && (
                  <span className="text-gray-500">
                    {sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort("cost")}
                className="flex items-center cursor-pointer hover:bg-gray-50 transition-colors px-3 py-2"
              >
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span className="flex-1">Cost</span>
                {sort.field === "cost" && (
                  <span className="text-gray-500">
                    {sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort("duration")}
                className="flex items-center cursor-pointer hover:bg-gray-50 transition-colors px-3 py-2"
              >
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="flex-1">Duration</span>
                {sort.field === "duration" && (
                  <span className="text-gray-500">
                    {sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-t border-b border-gray-200 bg-gray-50/50">
              <TableHead className="w-[250px] py-3 pl-6 pr-3 text-sm font-semibold text-gray-900">
                Customer
              </TableHead>
              <TableHead className="w-[200px] px-3 py-3 text-sm font-semibold text-gray-900">
                Email
              </TableHead>
              <TableHead className="w-[150px] px-3 py-3 text-sm font-semibold text-gray-900">
                Phone
              </TableHead>
              <TableHead className="w-[150px] px-3 py-3 text-sm font-semibold text-gray-900">
                Date & Time
              </TableHead>
              <TableHead className="w-[100px] px-3 py-3 text-sm font-semibold text-gray-900">
                Duration
              </TableHead>
              <TableHead className="w-[100px] px-3 py-3 text-sm font-semibold text-gray-900">
                Cost
              </TableHead>
              <TableHead className="w-[250px] px-3 py-3 text-sm font-semibold text-gray-900">
                Summary
              </TableHead>
              {showGrade && (
                <TableHead className="w-[100px] px-3 py-3 text-sm font-semibold text-gray-900">
                  Grade
                </TableHead>
              )}
              {showStatus && (
                <TableHead className="w-[120px] px-3 py-3 text-sm font-semibold text-gray-900">
                  Status
                </TableHead>
              )}
              <TableHead className="w-[120px] px-3 py-3 text-sm font-semibold text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTableData.map((call) => (
              <TableRow
                key={call.id}
                className="group hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-200 last:border-0"
                onClick={() => {
                  setSelectedCall(call);
                  setSlideOverOpen(true);
                  onCallClick?.(call);
                }}
              >
                <TableCell className="py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {call.customerInitial}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {call.customerName}
                      </span>
                      {isNewCall(call.date) && (
                        <Badge className="w-fit mt-1" variant="secondary">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600 truncate block">
                    {call.customerEmail}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600">
                    {call.customerNumber}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(call.date), "MMM d, yyyy")}
                  </span>
                  <span className="text-sm text-gray-500 block">
                    {format(new Date(call.date), "h:mm a")}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600">{call.duration}</span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600">
                    {formatCurrency(call.cost)}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="text-sm text-gray-600 line-clamp-2">
                    {truncateText(call.summary, 20)}
                  </span>
                </TableCell>
                {showGrade && (
                  <TableCell className="px-3 py-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
                        getGradeColor(call.grade)
                      )}
                    >
                      {call.grade === true
                        ? "Pass"
                        : call.grade === false
                        ? "Fail"
                        : "N/A"}
                    </Badge>
                  </TableCell>
                )}
                {showStatus && (
                  <TableCell className="px-3 py-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
                        getStatusColor(call.status)
                      )}
                    >
                      {call.status}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg border border-blue-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPause(call.recording_url);
                            }}
                          >
                            {audioState.currentUrl === call.recording_url &&
                            audioState.isPlaying ? (
                              <Pause className="h-4 w-4 text-blue-700 group-hover:text-blue-800" />
                            ) : (
                              <Play className="h-4 w-4 text-blue-700 group-hover:text-blue-800" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">
                            {audioState.currentUrl === call.recording_url &&
                            audioState.isPlaying
                              ? "Pause Recording"
                              : "Play Recording"}
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-lg border border-emerald-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              const filename = `call-recording-${format(
                                new Date(call.date),
                                "yyyy-MM-dd-HH-mm"
                              )}.wav`;
                              downloadAudio(call.recording_url, filename);
                            }}
                          >
                            <Download className="h-4 w-4 text-emerald-700 group-hover:text-emerald-800" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">Download Recording</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-purple-50 hover:bg-purple-100 transition-colors rounded-lg border border-purple-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onCallClick) {
                                onCallClick(call);
                              } else {
                                setSelectedCall(call);
                                setSlideOverOpen(true);
                              }
                            }}
                          >
                            <MoreVertical className="h-4 w-4 text-purple-700 group-hover:text-purple-800" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={sortedCalls.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      </div>

      {!onCallClick && (
        <CallDetailsSlideOver
          call={selectedCall}
          open={slideOverOpen}
          onClose={() => {
            setSlideOverOpen(false);
            setSelectedCall(null);
          }}
        />
      )}
    </div>
  );
}

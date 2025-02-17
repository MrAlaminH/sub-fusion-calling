export interface CallRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  customerInitial: string;
  date: string;
  duration: string;
  type: string;
  status: string;
  summary: string;
  transcript: string;
  cost: number;
  assistant_name: string;
  assistant_model_model: string;
  assistant_transcriber_model: string;
  grade: boolean | null;
  tags: string[];
  ended_reason: string;
  recording_url: string;
  stereo_recording_url: string;
  phone_number_id?: string;
  created_at?: string;
}

export interface CallDetailsSlideOverProps {
  call: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

export interface CallHistoryProps {
  calls: CallRecord[];
  title?: string;
  subtitle?: string;
  showGrade?: boolean;
  showStatus?: boolean;
  onCallClick?: (call: CallRecord) => void;
  customActions?: React.ReactNode;
}

export interface SortConfig {
  field: keyof CallRecord;
  direction: "asc" | "desc";
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentUrl: string | null;
  audio: HTMLAudioElement | null;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  siblingCount?: number;
} 
import type { Lead } from './types';

// Define which fields we want to display in the table
export type DisplayableFields = Exclude<keyof Lead, 'id'>;

export const FIELD_MAPPINGS: Record<DisplayableFields, string> = {
  name: "Name",
  company: "Company",
  phone: "Phone",
  email: "Email",
  status: "Status",
  updated_at: "Last Updated",
  created_at: "Created At",
} as const;

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
] as const;

export const STATUS_STYLES: Record<Lead['status'], string> = {
  pending: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  'in-progress': "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  failed: "bg-red-100 text-red-800 hover:bg-red-200"
} as const;

export const NON_EDITABLE_FIELDS: readonly DisplayableFields[] = [
  "created_at",
  "updated_at"
] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  PAGE_SIZE: 'leadTablePageSize',
  SORT_STATE: 'leadTableSort',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
  DATE_FORMAT: 'MMM dd, yyyy HH:mm',
  PHONE_FORMAT: '+1 (###) ###-####',
} as const;

// CSV Import Settings
export const CSV_IMPORT = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  FILE_EXTENSIONS: ['.csv'],
} as const;

// Validation Rules
export const VALIDATION = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^\+?[\d\s-()]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;

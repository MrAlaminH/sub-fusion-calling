// Lead type definition
export interface Lead {
  id: string; // UUID from database
  name: string;
  email: string;
  phone: string;
  company: string | null;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CSVPreviewData {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface CSVDialogProps {
  previewData: CSVPreviewData[];
  onConfirm: (data: CSVPreviewData[]) => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

export interface LeadTableProps {
  initialLeads: Lead[];
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  deleteLeads: (ids: string[]) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (ids: string[], status: Lead['status']) => Promise<void>;
  getLeads: (params: GetLeadsParams) => Promise<GetLeadsResponse>;
}

export interface GetLeadsParams {
  sortBy?: {
    column: keyof Lead;
    ascending: boolean;
  };
  page?: number;
  pageSize?: number;
}

export interface GetLeadsResponse {
  data: Lead[];
  count: number;
}

export interface SortState {
  column: keyof Lead | null;
  direction: 'asc' | 'desc' | null;
}

export interface EditingCell {
  id: string;
  field: keyof Lead;
}

// Using Pick type to create a subset of Lead properties for the form state
export type LeadFormState = Partial<Pick<Lead, 'name' | 'email' | 'phone' | 'company'>>;

export interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadFormState) => Promise<void>;
  initialData?: LeadFormState;
  mode?: 'add' | 'edit';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  sortState: SortState;
  onSort: (column: keyof Lead) => void;
  hasLeads: boolean;
}

export interface TableBodyProps {
  leads: Lead[];
  selectedLeads: string[];
  editingCell: EditingCell | null;
  onToggleLead: (id: string) => void;
  onEdit: (id: string, field: keyof Lead, value: string) => Promise<void>;
  onStartEdit: (id: string | null, field: keyof Lead | null) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string, field: keyof Lead, value: string) => void;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCell | null>>;
  isLoading?: boolean;
}

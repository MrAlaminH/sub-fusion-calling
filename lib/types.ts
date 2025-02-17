export type SortDirection = "asc" | "desc" | "none";

export interface SortCriterion {
  column: string;
  direction: SortDirection;
}

export interface FilterCriterion {
  column: string;
  value: string;
  type: "contains" | "equals";
}

export type LeadStatus = "Pending" | "Calling" | "No Answer" | "Scheduled" | "Not Interested";

export interface Lead {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  timezone: string;
  call_attempts: number;
  last_called_at?: string;
  notes?: string;
  user_id: string;
}

export interface CreateLeadInput {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  timezone: string;
  notes?: string;
}

export interface ImportLeadRow {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  timezone: string;
  notes?: string;
}

export interface AICallData {
  id: string;
  phone_number_id: string;
  type: string;
  started_at: string;
  ended_at: string;
  duration_minutes: number;
  transcript: string;
  recording_url: string;
  stereo_recording_url: string;
  summary: string;
  created_at: string;
  updated_at: string;
  org_id: string;
  
  // Customer Information
  customer_number: string;
  customer_name: string;
  customer_email: string;
  
  status: string;
  ended_reason: string;
  
  // Analysis Data
  analysis_summary: string;
  analysis_success_evaluation: boolean;
  
  // Assistant Data
  assistant_name: string;
  assistant_transcriber_model: string;
  assistant_transcriber_provider: string;
  assistant_model_model: string;
  assistant_model_provider: string;
  
  // Cost Breakdown
  cost: number;
  stt_cost: number;
  llm_cost: number;
  tts_cost: number;
  vapi_cost: number;
  analysis_cost: number;
  
  // Token Usage
  llm_prompt_tokens: number;
  llm_completion_tokens: number;
  tts_characters: number;
  
  // Provider Info
  phone_call_provider: string;
  phone_call_provider_id: string;
  phone_call_transport: string;
  
  // Monitor URLs
  monitor_listen_url: string;
  monitor_control_url: string;
} 
CREATE TABLE vapi_call_data (
    id UUID PRIMARY KEY,
    phone_number_id UUID,
    type TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_minutes NUMERIC, -- Store duration in minutes
    transcript TEXT,
    recording_url TEXT,
    stereo_recording_url TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    org_id UUID,

    -- Customer Information
    customer_number TEXT,
    customer_name TEXT,
    customer_email TEXT,

    status TEXT,
    ended_reason TEXT,

    -- Analysis Data
    analysis_summary TEXT,
    analysis_success_evaluation BOOLEAN,

    -- Assistant Data (flattened for simplicity, adjust as needed)
    assistant_name TEXT,
    assistant_transcriber_model TEXT,
    assistant_transcriber_provider TEXT,
    assistant_model_model TEXT,
    assistant_model_provider TEXT,

    -- Cost Breakdown
    cost NUMERIC,  -- Total cost
    stt_cost NUMERIC, -- Speech-to-text cost
    llm_cost NUMERIC, -- Language model cost
    tts_cost NUMERIC, -- Text-to-speech cost
    vapi_cost NUMERIC, -- VAPI cost
    analysis_cost NUMERIC, --analysis cost
    --Token Usage
    llm_prompt_tokens INTEGER,
    llm_completion_tokens INTEGER,
    tts_characters INTEGER,

    -- provider info
    phone_call_provider TEXT,
    phone_call_provider_id TEXT,
    phone_call_transport TEXT,

    -- Monitor URLs - can be useful for debugging/linking
    monitor_listen_url TEXT,
    monitor_control_url TEXT
);
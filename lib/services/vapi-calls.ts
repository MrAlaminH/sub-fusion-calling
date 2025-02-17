import { supabase } from '../supabase/client'
import { AICallData } from '../types'

export class VAPICallService {
  static async testConnection(): Promise<boolean> {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('id')
      .limit(1)

    if (error) throw new Error(error.message)
    
    console.log('Connection test data:', data)
    return true
  }

  static async getVAPICalls(): Promise<AICallData[]> {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as AICallData[]
  }

  static async getVAPICallById(callId: string): Promise<AICallData> {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('*')
      .eq('id', callId)
      .single()

    if (error) throw new Error(error.message)
    return data as AICallData
  }

  static async getVAPICallsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<AICallData[]> {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as AICallData[]
  }

  static async getVAPICallStats() {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('*')

    if (error) throw new Error(error.message)
    const calls = data as AICallData[]

    return {
      totalCalls: calls.length,
      totalDuration: calls.reduce((acc, call) => acc + (call.duration_minutes || 0), 0),
      totalCost: calls.reduce((acc, call) => acc + (call.cost || 0), 0),
      averageDuration: calls.length ? 
        calls.reduce((acc, call) => acc + (call.duration_minutes || 0), 0) / calls.length : 0,
      averageCost: calls.length ? 
        calls.reduce((acc, call) => acc + (call.cost || 0), 0) / calls.length : 0,
    }
  }

  static async searchVAPICalls(
    searchTerm: string
  ): Promise<AICallData[]> {
    const { data, error } = await supabase
      .from('vapi_call_data')
      .select('*')
      .or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_number.ilike.%${searchTerm}%,transcript.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as AICallData[]
  }

  static subscribeToVAPICalls(callback: (payload: AICallData) => void) {
    const subscription = supabase
      .channel('vapi_call_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'vapi_call_data'
        },
        (payload) => {
          callback(payload.new as AICallData)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }
} 
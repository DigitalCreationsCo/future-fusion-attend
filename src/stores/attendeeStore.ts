
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];
type Attendee = Database['public']['Tables']['attendees']['Row'];

interface AttendeeState {
  attendees: Attendee[];
  events: Event[];
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getAttendeesByEventId: (eventId: string) => Attendee[];
  getEventById: (eventId: string) => Event | undefined;
  addAttendee: (eventId: string, name: string, email: string) => Promise<void>;
  loadEvents: () => Promise<void>;
  loadAttendees: () => Promise<void>;
}

export const useAttendeeStore = create<AttendeeState>((set, get) => ({
  attendees: [],
  events: [],
  isSubmitting: false,
  isLoading: false,
  error: null,
  
  getAttendeesByEventId: (eventId: string) => {
    return get().attendees.filter(a => a.event_id === eventId);
  },
  
  getEventById: (eventId: string) => {
    return get().events.find(e => e.id === eventId);
  },
  
  addAttendee: async (eventId: string, name: string, email: string) => {
    set({ isSubmitting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('attendees')
        .insert([{ event_id: eventId, name, email }]);
      
      if (error) throw error;
      
      // Reload attendees to get the latest data
      await get().loadAttendees();
      
      set({ isSubmitting: false });
    } catch (error) {
      set({ 
        isSubmitting: false, 
        error: error instanceof Error ? error.message : 'Failed to RSVP' 
      });
      throw error;
    }
  },
  
  loadEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      set({ events: events || [], isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load events' 
      });
    }
  },
  
  loadAttendees: async () => {
    set({ isLoading: true });
    
    try {
      const { data: attendees, error } = await supabase
        .from('attendees')
        .select('*')
        .order('rsvp_date', { ascending: false });
      
      if (error) throw error;
      
      set({ attendees: attendees || [], isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load attendees' 
      });
    }
  },
}));

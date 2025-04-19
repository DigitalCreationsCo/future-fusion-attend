
import { create } from 'zustand';
import { generateRandomId } from '@/lib/utils';

export type Attendee = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  rsvpDate: string;
  eventId: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
};

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
    return get().attendees.filter(a => a.eventId === eventId);
  },
  
  getEventById: (eventId: string) => {
    return get().events.find(e => e.id === eventId);
  },
  
  addAttendee: async (eventId: string, name: string, email: string) => {
    set({ isSubmitting: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAttendee: Attendee = {
        id: generateRandomId(),
        name,
        email,
        rsvpDate: new Date().toISOString(),
        eventId,
      };
      
      set(state => ({
        attendees: [...state.attendees, newAttendee],
        events: state.events.map(event => 
          event.id === eventId 
            ? { ...event, attendeeCount: event.attendeeCount + 1 } 
            : event
        ),
        isSubmitting: false,
      }));
      
      // Save to local storage (mock database)
      const currentAttendees = JSON.parse(localStorage.getItem('attendees') || '[]');
      localStorage.setItem('attendees', JSON.stringify([...currentAttendees, newAttendee]));
      
      // Update event count in local storage
      const currentEvents = JSON.parse(localStorage.getItem('events') || '[]');
      localStorage.setItem('events', JSON.stringify(
        currentEvents.map((event: Event) => 
          event.id === eventId 
            ? { ...event, attendeeCount: event.attendeeCount + 1 } 
            : event
        )
      ));
      
    } catch (error) {
      set({ 
        isSubmitting: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      throw error;
    }
  },
  
  loadEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Check if we have events in local storage
      const storedEvents = localStorage.getItem('events');
      
      // If no events found, create a sample event
      if (!storedEvents) {
        const sampleEvent: Event = {
          id: 'evt-1',
          title: 'Neo Tokyo 2070 Tech Summit',
          description: 'Join the most innovative minds for a glimpse into the future of technology. Experience demos of cutting-edge neural interfaces and quantum computing applications.',
          date: '2070-05-15T00:00:00Z',
          time: '18:00 - 22:00',
          location: 'Quantum District, Neo Tokyo',
          attendeeCount: 0
        };
        
        localStorage.setItem('events', JSON.stringify([sampleEvent]));
        set({ events: [sampleEvent], isLoading: false });
      } else {
        const parsedEvents = JSON.parse(storedEvents);
        set({ events: parsedEvents, isLoading: false });
      }
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const storedAttendees = localStorage.getItem('attendees');
      if (storedAttendees) {
        set({ 
          attendees: JSON.parse(storedAttendees),
          isLoading: false 
        });
      } else {
        set({ attendees: [], isLoading: false });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load attendees' 
      });
    }
  },
}));

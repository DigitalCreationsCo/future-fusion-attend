
import React from 'react';
import { useAttendeeStore } from '@/stores/attendeeStore';
import EventCard from '@/components/EventCard';
import AttendeeList from '@/components/AttendeeList';
import RSVPForm from '@/components/RSVPForm';

const Index = () => {
  const { events, loadEvents, loadAttendees, getAttendeesByEventId, isLoading } = useAttendeeStore();

  React.useEffect(() => {
    // Load data on component mount
    loadEvents();
    loadAttendees();
  }, [loadEvents, loadAttendees]);

  // We're using the first event for this simple version
  const event = events[0];
  const attendees = event ? getAttendeesByEventId(event.id) : [];

  if (isLoading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-text-animated text-xl font-orbitron animate-float">
          Initializing Quantum Interface...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-orbitron neo-text-animated mb-3">Future Fusion</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          The next generation event attendance system for the hypermodern world
        </p>
      </header>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventCard event={event} />
          
          <div className="mt-8">
            <AttendeeList attendees={attendees} isLoading={isLoading} />
          </div>
        </div>
        
        <div>
          <RSVPForm eventId={event.id} />
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-foreground/50">
        <p>© 2070 Future Fusion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;

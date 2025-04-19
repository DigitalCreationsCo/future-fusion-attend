
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventTime } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import CreateEventModal from '@/components/CreateEventModal';

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

const EventsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="neo-text-animated text-xl font-orbitron animate-float">
        Loading Events...
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error loading events: {error.message}
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-orbitron neo-text-animated mb-3">Upcoming Events</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Browse and explore all future events
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full bg-gradient-to-r from-neo-cyan to-neo-purple hover:from-neo-purple hover:to-neo-cyan text-white"
        >
          Create New Event
        </Button>

        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No events found. Create your first event!
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="neo-card animate-float">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{event.title}</CardTitle>
                  <div className="text-sm text-neo-cyan">
                    {formatEventTime(event.date, event.time)}
                  </div>
                </div>
                <CardDescription>{event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
                <Link to={`/event/${event.id}`} className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    View Event Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default EventsPage;

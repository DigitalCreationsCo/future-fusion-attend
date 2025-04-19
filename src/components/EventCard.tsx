
import React, { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventTime } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  const [attendeeCount, setAttendeeCount] = useState(0);

  useEffect(() => {
    // Get initial count
    const getAttendeeCount = async () => {
      const { count } = await supabase
        .from('attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);
      
      setAttendeeCount(count || 0);
    };

    getAttendeeCount();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendees',
          filter: `event_id=eq.${event.id}`
        },
        async () => {
          // Refresh count on any changes
          const { count } = await supabase
            .from('attendees')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);
          
          setAttendeeCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id]);

  return (
    <Card className="neo-card animate-float">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-orbitron neo-text">{event.title}</CardTitle>
          <div className="flex items-center gap-1 text-neo-cyan text-sm font-medium">
            <CalendarCheck className="h-4 w-4" />
            <span>{formatEventTime(event.date, event.time)}</span>
          </div>
        </div>
        <CardDescription className="text-foreground/70">
          {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{event.description}</p>
        <div className="text-sm flex justify-between items-center mt-4">
          <div className="bg-muted px-3 py-1 rounded-full text-neo-cyan">
            {attendeeCount} attending
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;



import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventTime } from '@/lib/utils';

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    attendeeCount: number;
  };
};

const EventCard = ({ event }: EventCardProps) => {
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
            {event.attendeeCount} attending
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;

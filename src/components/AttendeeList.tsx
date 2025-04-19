import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Database } from '@/integrations/supabase/types';

type Attendee = Database['public']['Tables']['attendees']['Row'];

type AttendeeListProps = {
  attendees: Attendee[];
  isLoading?: boolean;
};

const AttendeeList = ({ attendees, isLoading = false }: AttendeeListProps) => {
  if (isLoading) {
    return (
      <div className="neo-card p-6 h-[400px] flex items-center justify-center">
        <div className="neo-text-animated font-orbitron">Loading attendees...</div>
      </div>
    );
  }

  return (
    <div className="neo-card p-6">
      <h2 className="text-xl font-orbitron neo-text mb-4">Event Attendees</h2>
      
      <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-4">
          {attendees.length > 0 ? (
            attendees.map((attendee) => (
              <div 
                key={attendee.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 backdrop-blur-sm border border-white/5 hover:border-neo-cyan/40 transition-all"
              >
                <Avatar className="h-10 w-10 border border-neo-cyan/30 animate-pulse-border">
                  <AvatarImage src={attendee.avatar_url || undefined} />
                  <AvatarFallback className="bg-background">
                    <User className="h-5 w-5 text-neo-purple" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{attendee.name}</div>
                  <div className="text-xs text-muted-foreground">
                    RSVP'd {new Date(attendee.rsvp_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendees yet. Be the first to RSVP!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AttendeeList;

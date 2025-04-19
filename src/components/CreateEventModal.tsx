
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  description: z.string().optional(),
  password: z.string().min(4, "Password must be at least 4 characters")
});

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: values.title,
          date: values.date,
          time: values.time,
          location: values.location,
          description: values.description || null,
          creation_password: values.password
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ['events'] });
      form.reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] neo-card">
        <DialogHeader>
          <DialogTitle className="neo-text">Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the details for your event. You'll need a password to create it.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tech Conference 2070" 
                      {...field} 
                      className="bg-muted/50 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-muted/50 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="bg-muted/50 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Quantum Conference Center" 
                      {...field} 
                      className="bg-muted/50 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tell us about your event" 
                      {...field} 
                      className="bg-muted/50 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Creation Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter creation password" 
                      {...field} 
                      className="bg-muted/50 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-neo-cyan to-neo-purple hover:from-neo-purple hover:to-neo-cyan text-white"
            >
              Create Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;


import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAttendeeStore } from '@/stores/attendeeStore';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type RSVPFormProps = {
  eventId: string;
};

const RSVPForm = ({ eventId }: RSVPFormProps) => {
  const { toast } = useToast();
  const { addAttendee, isSubmitting } = useAttendeeStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addAttendee(eventId, values.name, values.email);
      form.reset();
      toast({
        title: "RSVP Successful!",
        description: "You have been added to the attendee list.",
      });
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: "There was an error submitting your RSVP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="neo-card p-6">
      <h2 className="text-xl font-orbitron neo-text mb-6">RSVP to Event</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neo-cyan">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    className="bg-muted/50 border-white/10 focus:border-neo-cyan/70 transition-all" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neo-cyan">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email"
                    className="bg-muted/50 border-white/10 focus:border-neo-cyan/70 transition-all" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-neo-cyan to-neo-purple hover:from-neo-purple hover:to-neo-cyan text-white font-medium transition-all duration-300 neo-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "RSVP Now"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RSVPForm;

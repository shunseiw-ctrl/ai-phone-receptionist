import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings2, Save, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const settingsSchema = z.object({
  systemPrompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }).max(2000, {
    message: "Prompt is too long (max 2000 characters).",
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      systemPrompt: "",
    },
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        systemPrompt: settings.systemPrompt,
      });
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-primary" />
          AI Settings
        </h1>
        <p className="text-muted-foreground">Configure how your AI receptionist behaves and responds to callers.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="glass-panel border-white/5 shadow-2xl relative overflow-hidden group">
          {/* Decorative glowing gradient behind the card */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] -z-10 pointer-events-none" />
          
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-display">
              <Sparkles className="w-5 h-5 text-primary" />
              System Prompt
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">
              This prompt instructs the AI on its persona, goals, and rules for handling incoming calls. 
              Be explicit about how it should identify and reject sales calls.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-white/5" />
                <Skeleton className="h-48 w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-10 w-32 bg-white/5 rounded-lg" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">AI Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the instructions for your AI assistant..." 
                            className="min-h-[200px] resize-y bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-base p-4 leading-relaxed font-sans placeholder:text-muted-foreground/50 transition-all duration-300"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground/70">
                          Changes take effect immediately for the next incoming call.
                        </FormDescription>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      type="submit" 
                      disabled={updateSettings.isPending || !form.formState.isDirty}
                      className="px-8 py-6 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {updateSettings.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

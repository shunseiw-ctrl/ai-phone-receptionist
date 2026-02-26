import { useState } from "react";
import { useCalls, useCall } from "@/hooks/use-calls";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneCall, Clock, FileText, Bot } from "lucide-react";
import { TranscriptBubble } from "@/components/calls/TranscriptBubble";

export default function CallLogs() {
  const { data: calls, isLoading } = useCalls();
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);
  
  // Prefetch details when a row is clicked
  const { data: selectedCall, isLoading: isDetailsLoading } = useCall(selectedCallId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25 transition-colors">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/20 hover:bg-rose-500/25 transition-colors">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Call Logs</h1>
        <p className="text-muted-foreground">Review history and transcripts of AI-handled calls.</p>
      </div>

      <Card className="glass-panel overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-muted-foreground">Date & Time</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Caller</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell><Skeleton className="h-5 w-32 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              ) : calls?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <PhoneCall className="w-8 h-8 opacity-20" />
                      <p>No call logs found yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                calls?.map((call) => (
                  <TableRow 
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className="cursor-pointer border-white/5 hover:bg-white/[0.04] transition-colors group"
                  >
                    <TableCell className="font-medium">
                      {call.createdAt ? format(new Date(call.createdAt), "MMM d, yyyy • h:mm a") : "Unknown"}
                    </TableCell>
                    <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {call.callerNumber || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(call.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDuration(call.duration)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Slide-out Sheet for Call Details */}
      <Sheet open={selectedCallId !== null} onOpenChange={(open) => !open && setSelectedCallId(null)}>
        <SheetContent className="w-full sm:max-w-xl glass-panel border-l-white/10 p-0 flex flex-col sm:max-w-[600px]">
          <SheetHeader className="p-6 border-b border-white/5 bg-background/50">
            <SheetTitle className="font-display text-2xl flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-primary" />
              Call Details
            </SheetTitle>
            <SheetDescription className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {selectedCall?.duration ? formatDuration(selectedCall.duration) : "0s"}
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-muted-foreground">{selectedCall?.callerNumber}</span>
              <span className="text-white/20">•</span>
              {selectedCall && getStatusBadge(selectedCall.status)}
            </SheetDescription>
          </SheetHeader>

          {isDetailsLoading ? (
            <div className="p-6 space-y-6 flex-1">
              <Skeleton className="h-24 w-full bg-white/5 rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 bg-white/5 rounded-2xl" />
                <Skeleton className="h-16 w-3/4 bg-white/5 rounded-2xl ml-auto" />
                <Skeleton className="h-16 w-3/4 bg-white/5 rounded-2xl" />
              </div>
            </div>
          ) : selectedCall ? (
            <ScrollArea className="flex-1 p-6">
              {/* Summary Section */}
              {selectedCall.summary && (
                <div className="mb-8 p-5 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4" /> AI Summary
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {selectedCall.summary}
                  </p>
                </div>
              )}

              {/* Transcript Section */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                  <Bot className="w-4 h-4" /> Transcript
                </h4>
                
                {Array.isArray(selectedCall.transcript) && selectedCall.transcript.length > 0 ? (
                  <div className="space-y-2">
                    {(selectedCall.transcript as Array<{role: 'user'|'assistant', content: string}>).map((msg, idx) => (
                      <TranscriptBubble 
                        key={idx} 
                        index={idx}
                        role={msg.role} 
                        content={msg.content} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    No transcript available for this call.
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

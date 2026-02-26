import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { clsx } from "clsx";

interface TranscriptBubbleProps {
  role: "user" | "assistant";
  content: string;
  index: number;
}

export function TranscriptBubble({ role, content, index }: TranscriptBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={clsx(
        "flex w-full mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={clsx(
        "flex max-w-[85%] gap-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 border",
          isAssistant 
            ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
            : "bg-secondary text-muted-foreground border-white/10"
        )}>
          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div className={clsx(
          "px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
          isAssistant 
            ? "bg-secondary/80 border border-white/5 text-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
        )}>
          {content}
        </div>
      </div>
    </motion.div>
  );
}

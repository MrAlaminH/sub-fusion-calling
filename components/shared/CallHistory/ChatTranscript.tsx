import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "AI" | "User";
  content: string;
}

interface ChatTranscriptProps {
  transcript: string;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isAI = message.role === "AI";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-3 px-2",
        isAI ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            isAI
              ? "bg-gradient-to-r from-violet-600 to-indigo-600"
              : "bg-gradient-to-r from-blue-600 to-sky-600",
            "ring-2 ring-white"
          )}
        >
          {isAI ? (
            <Bot className="h-5 w-5 text-white" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isAI ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isAI
              ? "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800"
              : "bg-gradient-to-br from-blue-600 to-blue-500 text-white",
            "shadow-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export function ChatTranscript({ transcript }: ChatTranscriptProps) {
  const parseTranscript = (text: string): Message[] => {
    if (!text) return [];

    // Split by newlines and filter out empty lines
    const lines = text.split("\n").filter((line) => line.trim());
    const messages: Message[] = [];
    let currentMessage: Message | null = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check if line starts with AI: or User:
      if (trimmedLine.startsWith("AI:")) {
        if (currentMessage) {
          messages.push(currentMessage);
        }
        currentMessage = {
          role: "AI",
          content: trimmedLine.substring(3).trim(),
        };
      } else if (trimmedLine.startsWith("User:")) {
        if (currentMessage) {
          messages.push(currentMessage);
        }
        currentMessage = {
          role: "User",
          content: trimmedLine.substring(5).trim(),
        };
      } else if (currentMessage) {
        // Append to current message if it's a continuation
        currentMessage.content += "\n" + trimmedLine;
      }
    });

    // Don't forget to add the last message
    if (currentMessage) {
      messages.push(currentMessage);
    }

    return messages;
  };

  const messages = parseTranscript(transcript);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <p>No transcript available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 px-2">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Bot, User, Loader2 } from "lucide-react";
import { Message, MessageType } from "@/types";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex mb-4 ${
        message.type === MessageType.USER ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[85%] ${
          message.type === MessageType.USER ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full shadow-md ${
            message.type === MessageType.USER
              ? "bg-gradient-to-br from-blue-500 to-indigo-600"
              : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
          }`}
        >
          {message.type === MessageType.USER ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`
          relative rounded-2xl p-4 shadow-sm backdrop-blur-sm
          ${
            message.type === MessageType.USER
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : message.error
              ? "bg-red-50/90 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50"
              : "bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50"
          }
        `}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div
              className={`absolute inset-0 opacity-10 ${
                message.type === MessageType.USER
                  ? "bg-pattern-light"
                  : "bg-pattern-dark dark:bg-pattern-light"
              }`}
            ></div>
          </div>

          {/* Message content */}
          <div className="relative">
            {message.loading ? (
              <div className="flex items-center space-x-3 py-1">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Thinking...</span>
              </div>
            ) : (
              <div className="whitespace-pre-line text-base">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

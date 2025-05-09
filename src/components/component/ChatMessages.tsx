/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Message } from "@/types";
import { ChevronDown } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  autoScroll: boolean;
}

export const ChatMessages = ({ messages, autoScroll }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollAreaRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

      setIsScrolled(!isAtBottom && messages.length > 0);
      setShowScrollButton(!isAtBottom && messages.length > 0);
    };

    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages.length]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex-1 flex flex-col">
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4 mb-25 md:px-6 overflow-y-auto"
        type="auto"
      >
        <div className="space-y-4 pb-12">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[60vh] text-gray-400 dark:text-gray-500 text-center p-8">
              <div>
                <div className="mb-2 text-xl font-medium">No messages yet</div>
                <p>Start a conversation to see messages appear here</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl active:translate-y-1"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
};

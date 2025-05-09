/* eslint-disable @typescript-eslint/no-unused-vars */
// app/chat/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Message, MessageType } from "@/types";
import { INITIAL_MESSAGES } from "./Chat";
import { generateAIResponse } from "./AI";
import { ChatHeader } from "./ChatHeader";
import { ChatStarters } from "./ChatStarters";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

const ChatPage = () => {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (
    e?: React.MouseEvent | React.FormEvent
  ): Promise<void> => {
    e?.preventDefault();

    if (!query.trim()) return;

    const userMessage: Message = { type: MessageType.USER, content: query };
    setMessages((prev) => [...prev, userMessage]);

    setQuery("");
    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        { type: MessageType.BOT, loading: true },
      ]);

      const responseText = await generateAIResponse(query);

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          type: MessageType.BOT,
          content: responseText,
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          type: MessageType.BOT,
          content: "Something went wrong. Please try again.",
          error: true,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = (): void => {
    setMessages([
      {
        type: MessageType.BOT,
        content: "Chat cleared. How can I help you today?",
      },
    ]);
  };

  const handleConversationStarter = (starter: string): void => {
    setQuery(starter);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // CSS styling for hiding scrollbar while maintaining scroll functionality
  const scrollableStyle = {
    scrollbarWidth: "none" as const, // Firefox
    msOverflowStyle: "none" as const, // IE 10+
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader onClearChat={clearChat} />

      <div className="flex-1 overflow-auto" style={scrollableStyle}>
        <div
          className="h-full max-w-4xl mx-auto flex flex-col overflow-y-auto"
          style={scrollableStyle}
        >
          {messages.length <= 1 && (
            <ChatStarters onSelectStarter={handleConversationStarter} />
          )}

          <ChatMessages messages={messages} autoScroll={autoScroll} />

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        query={query}
        setQuery={setQuery}
        loading={loading}
        handleSend={handleSend}

      />
    </div>
  );
};

export default ChatPage;
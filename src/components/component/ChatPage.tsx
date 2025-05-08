/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, ChevronDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

enum MessageType {
  USER = "user",
  BOT = "bot",
}

interface Message {
  type: MessageType;
  content?: string;
  loading?: boolean;
  error?: boolean;
}

const ChatPage = () => {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: MessageType.BOT, 
      content: "Hi there! I'm your AI assistant. How can I help you today?" 
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const conversationStarters: string[] = [
    "How does this work?",
    "Tell me about AI ethics",
    "Write a short poem about technology",
    "Explain quantum computing simply"
  ];

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async (e?: React.MouseEvent | React.FormEvent): Promise<void> => {
    e?.preventDefault();
    
    if (!query.trim()) return;
    
    const userMessage: Message = { type: MessageType.USER, content: query };
    setMessages(prev => [...prev, userMessage]);
    
    setQuery("");
    
    setLoading(true);
    
    try {
      setMessages(prev => [...prev, { type: MessageType.BOT, loading: true }]);
      
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
      });
      
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? 
        "Sorry, I couldn't generate a response at the moment.";
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          type: MessageType.BOT, 
          content: responseText 
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Error:", error);
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          type: MessageType.BOT, 
          content: "Something went wrong. Please try again.",
          error: true
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = (): void => {
    setMessages([
      { 
        type: MessageType.BOT, 
        content: "Chat cleared. How can I help you today?" 
      },
    ]);
  };

  const handleConversationStarter = (starter: string): void => {
    setQuery(starter);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">AI Assistant</h1>
          </motion.div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={clearChat}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto flex flex-col">
          {messages.length <= 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-6"
            >
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Try asking about:
              </h2>
              <div className="flex flex-wrap gap-2">
                {conversationStarters.map((starter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConversationStarter(starter)}
                      className="text-sm bg-white dark:bg-gray-800"
                    >
                      {starter}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2 pb-10">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`flex ${
                      message.type === MessageType.USER ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${
                      message.type === MessageType.USER ? "flex-row-reverse" : ""
                    }`}>
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        message.type === MessageType.USER 
                          ? "bg-blue-500" 
                          : "bg-primary/10"
                      }`}>
                        {message.type === MessageType.USER ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      <Card className={`
                        ${message.type === MessageType.USER 
                          ? "bg-blue-500 text-white border-blue-600" 
                          : message.error 
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" 
                            : "bg-white dark:bg-gray-800"
                        }
                      `}>
                        <CardContent className="py-2">
                          {message.loading ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Thinking...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-line">{message.content}</div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-0 bg-white dark:bg-gray-800 border-t p-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={inputRef}
                placeholder="Type your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="pr-10 min-h-[60px] resize-none"
                rows={1}
              />
            </div>
            <Button 
              onClick={handleSend}
              size="icon" 
              disabled={loading || !query.trim()}
              className="h-10 w-10 rounded-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage;
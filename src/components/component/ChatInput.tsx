"use client";

import { useRef, useEffect } from "react";
import { Send, Loader2, PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  handleSend: (e?: React.MouseEvent | React.FormEvent) => Promise<void>;
  onAttachFile?: () => void;
}

export const ChatInput = ({
  query,
  setQuery,
  loading,
  handleSend,
  onAttachFile,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "60px"; // Reset height
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = Math.min(scrollHeight, 150) + "px"; // Cap at 150px
    }
  }, [query]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent pt-12 pb-6 z-10">
      <div className="max-w-3xl w-full mx-auto px-4">
        <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden relative">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-purple-50/10 dark:from-blue-900/5 dark:to-purple-900/5 pointer-events-none"></div>

          <div className="relative flex items-center gap-3 p-3">
            {onAttachFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAttachFile}
                className="h-10 w-10 rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all"
                title="Attach file"
              >
                <PaperclipIcon className="h-5 w-5" />
              </Button>
            )}

            <div className="relative flex-1 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <Textarea
                ref={inputRef}
                placeholder="Type your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 py-3 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
                rows={1}
              />
            </div>

            <Button
              onClick={(e) => handleSend(e)}
              size="icon"
              disabled={loading || !query.trim()}
              className={`h-10 w-10 rounded-full shadow-lg flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                query.trim() && !loading
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500"
                  : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 text-xs font-medium text-center flex justify-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-500/80 dark:text-gray-400/80">
            <kbd className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm text-gray-600 dark:text-gray-300">
              Enter
            </kbd>
            <span>to send</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-500/80 dark:text-gray-400/80">
            <kbd className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm text-gray-600 dark:text-gray-300">
              Shift+Enter
            </kbd>
            <span>for new line</span>
          </span>
        </div>
      </div>
    </div>
  );
};

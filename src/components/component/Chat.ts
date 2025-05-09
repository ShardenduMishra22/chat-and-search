import { Message, MessageType } from "@/types";

export const INITIAL_MESSAGES: Message[] = [
  { 
    type: MessageType.BOT, 
    content: "Hi there! I'm your AI assistant. How can I help you today?" 
  },
];

export const CONVERSATION_STARTERS: string[] = [
  "How does this work?",
  "Tell me about AI ethics",
  "Write a short poem about technology",
  "Explain quantum computing simply"
];
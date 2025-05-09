export enum MessageType {
  USER = "user",
  BOT = "bot",
}

export interface Message {
  type: MessageType;
  content?: string;
  loading?: boolean;
  error?: boolean;
}
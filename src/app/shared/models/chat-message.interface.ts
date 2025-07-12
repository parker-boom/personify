export type ChatSender = 'bot' | 'user';
export type ChatMessageType = 'statement' | 'question' | 'answer';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  type: ChatMessageType;
  content: string; // The text or prompt
  questionType?: string; // For questions/answers, e.g. 'short_text', 'slider', etc.
  relatedQuestionId?: string; // For answers, link to the question
  isSent: boolean; // Whether the message is visible in the chat
  timestamp: number; // For ordering/animation
  showProfilePicture?: boolean; // For bot messages, only on last in a sequence
  answer?: any; // User's answer for sent user messages
  isVisible?: boolean; // For progressive loading animation
}

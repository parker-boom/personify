/**
 * Chat Message Models
 *
 * Defines the structure for chat messages used in the conversational flow.
 * Messages can be bot statements, bot questions, or user answers.
 * Used by FlowService to create progressive conversation UI.
 */

export type ChatSender = 'bot' | 'user';
export type ChatMessageType =
  | 'statement' // Bot informational messages
  | 'question' // Bot questions requiring user input
  | 'answer' // User responses to questions
  | 'end-flow-button'; // Special completion button

/**
 * Individual chat message in the conversation flow
 * Supports progressive loading and interactive question components
 */
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

/**
 * API Service
 *
 * Handles HTTP communication with the backend API (Netlify function in production).
 * Processes user answers through OpenAI API and returns formatted custom instructions.
 * Automatically detects development vs production environment for endpoint configuration.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Structure for individual answer data sent to API
 * Contains question context and user response information
 */
export interface AnswerData {
  questionPrompt: string;
  questionType: string;
  categoryId: string;
  subcategoryId: string;
  answer: any;
  answerType: string;
  answerLength?: number;
}

/**
 * Request payload for processing answers
 * Wraps answer array for API consumption
 */
export interface ProcessAnswersRequest {
  answers: AnswerData[];
}

/**
 * Response from OpenAI API processing
 * Contains formatted custom instructions and memory prompt
 */
export interface ProcessAnswersResponse {
  CustomInstructionQ1: string;
  CustomInstructionQ2: string;
  MemoryPrompt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Auto-detect development vs production environment
  private readonly baseUrl =
    window.location.hostname === 'localhost' && window.location.port === '4200'
      ? 'http://localhost:3001/api' // Local Express server
      : '/api'; // Netlify function

  constructor(private http: HttpClient) {}

  /**
   * Process user answers through the backend API
   * @param answers Array of user answers
   * @returns Observable of the processed response
   */
  processAnswers(answers: AnswerData[]): Observable<ProcessAnswersResponse> {
    const payload: ProcessAnswersRequest = { answers };

    console.log('📤 Sending answers to backend:', payload);

    return this.http.post<ProcessAnswersResponse>(
      `${this.baseUrl}/process-answers`,
      payload
    );
  }

  /**
   * Health check endpoint
   * @returns Observable of health status
   */
  healthCheck(): Observable<{ status: string; message: string }> {
    return this.http.get<{ status: string; message: string }>(
      `${this.baseUrl.replace('/api', '')}/health`
    );
  }
}

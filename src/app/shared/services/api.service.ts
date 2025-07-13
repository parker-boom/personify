import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnswerData {
  questionPrompt: string;
  questionType: string;
  categoryId: string;
  subcategoryId: string;
  answer: any;
  answerType: string;
  answerLength?: number;
}

export interface ProcessAnswersRequest {
  answers: AnswerData[];
}

export interface ProcessAnswersResponse {
  CustomInstructionQ1: string;
  CustomInstructionQ2: string;
  MemoryPrompt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3001/api';

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

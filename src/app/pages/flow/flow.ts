import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlowService } from '../../shared/services/flow';
import { BaseQuestion } from '../../shared/models/question.interface';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flow.html',
  styleUrl: './flow.scss',
})
export class Flow implements OnInit {
  currentQuestion$: Observable<BaseQuestion | null>;
  flowState$: Observable<any>;
  allQuestions$: Observable<BaseQuestion[]>;
  progress$: Observable<any>;

  constructor(private flowService: FlowService, private router: Router) {
    this.flowState$ = this.flowService.flowState$;
    
    // Create observables for different parts of the flow state
    this.currentQuestion$ = this.flowState$.pipe(
      map(state => state.questions[state.progress.currentQuestionIndex] || null)
    );
    
    this.allQuestions$ = this.flowState$.pipe(
      map(state => state.questions)
    );
    
    this.progress$ = this.flowState$.pipe(
      map(state => state.progress)
    );
  }

  ngOnInit() {
    // Log the initial state to see what we're working with
    this.flowState$.subscribe(state => {
      console.log('Flow State:', state);
      console.log('Total Questions:', state.questions.length);
      console.log('Current Question Index:', state.progress.currentQuestionIndex);
      console.log('All Questions:', state.questions);
    });
  }

  getCurrentQuestion(): BaseQuestion | null {
    return this.flowService.getCurrentQuestion();
  }

  getCurrentQuestionIndex(): number {
    const state = this.flowService.getCurrentState();
    return state.progress.currentQuestionIndex;
  }

  getTotalQuestions(): number {
    const state = this.flowService.getCurrentState();
    return state.questions.length;
  }

  getAllQuestions(): BaseQuestion[] {
    const state = this.flowService.getCurrentState();
    return state.questions;
  }

  isFlowComplete(): boolean {
    return this.flowService.isFlowComplete();
  }

  completeFlow() {
    this.router.navigate(['/loading']);
  }

}

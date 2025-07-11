import { Injectable } from '@angular/core';
import {
  BaseQuestion,
  QuestionContext,
  SliderQuestion,
  TextQuestion,
  MultiSelectQuestion,
  DropdownQuestion,
  ToggleQuestion,
  SelectQuestion,
  StatementQuestion,
} from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionFactory {
  createQuestion(jsonQuestion: any, context: QuestionContext): BaseQuestion {
    switch (jsonQuestion.type) {
      case 'slider':
        return new SliderQuestion(jsonQuestion, context);

      case 'short_text':
      case 'long_text':
        return new TextQuestion(jsonQuestion, context);

      case 'multi_select':
        return new MultiSelectQuestion(jsonQuestion, context);

      case 'dropdown':
        return new DropdownQuestion(jsonQuestion, context);

      case 'toggle':
        return new ToggleQuestion(jsonQuestion, context);

      case 'select':
        return new SelectQuestion(jsonQuestion, context);

      case 'statement':
        return new StatementQuestion(jsonQuestion, context);

      default:
        throw new Error(`Unknown question type: ${jsonQuestion.type}`);
    }
  }

  createQuestionsFromJson(
    jsonQuestions: any[],
    context: QuestionContext
  ): BaseQuestion[] {
    return jsonQuestions.map((question, index) => {
      const questionContext = {
        ...context,
        order: context.order + index,
      };
      return this.createQuestion(question, questionContext);
    });
  }
}

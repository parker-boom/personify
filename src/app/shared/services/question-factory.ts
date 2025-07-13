/**
 * Question Factory Service
 *
 * Implements factory pattern for creating typed question instances from JSON data.
 * Converts raw question data into appropriate BaseQuestion subclasses based on type.
 * Used by FlowService to transform category questions into interactive components.
 */

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
  /**
   * Create a single typed question instance from JSON data
   * @param jsonQuestion Raw question data from category.json
   * @param context Category and subcategory context
   * @returns Typed BaseQuestion subclass instance
   */
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

  /**
   * Create multiple question instances from JSON array
   * @param jsonQuestions Array of raw question data
   * @param context Base context for all questions
   * @returns Array of typed BaseQuestion instances
   */
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

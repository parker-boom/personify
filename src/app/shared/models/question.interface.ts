/**
 * Question Type System
 *
 * Defines the type hierarchy for interactive questions in the flow.
 * BaseQuestion provides common properties, with specific question types
 * extending it for their unique requirements. Used by QuestionFactory
 * to create typed question instances from JSON data.
 */

export type QuestionType =
  | 'slider' // Numeric range input
  | 'short_text' // Single-line text input
  | 'long_text' // Multi-line text input
  | 'multi_select' // Multiple choice with checkboxes
  | 'dropdown' // Single choice dropdown
  | 'toggle' // Boolean on/off switch
  | 'select' // Single choice buttons
  | 'statement'; // Informational message (no input)

/**
 * Context information for question creation
 * Provides category and subcategory association
 */
export interface QuestionContext {
  categoryId: string;
  subcategoryId: string;
  order: number;
}

/**
 * Base question class for common properties
 * All question types extend this abstract class
 */
export abstract class BaseQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  order: number;
  categoryId: string;
  subcategoryId: string;
  answer?: any;

  constructor(data: any, context: QuestionContext) {
    this.id = data.id || `${context.subcategoryId}-q${context.order}`;
    this.prompt = data.prompt;
    this.type = data.type;
    this.order = context.order;
    this.categoryId = context.categoryId;
    this.subcategoryId = context.subcategoryId;
    this.answer = data.answer;
  }
}

/**
 * Slider question for numeric range input
 * Renders as interactive slider component
 */
export class SliderQuestion extends BaseQuestion {
  range: { min: number; max: number };
  default: number;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.range = data.range || { min: 1, max: 10 };
    this.default =
      data.default || Math.round((this.range.min + this.range.max) / 2);
  }
}

/**
 * Text question for short or long text input
 * Handles both single-line and multi-line text
 */
export class TextQuestion extends BaseQuestion {
  maxLength?: number;
  placeholder?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.maxLength = data.maxLength;
    this.placeholder = data.placeholder;
  }
}

/**
 * Multi-select question for multiple choice
 * Allows users to select multiple options from a list
 */
export class MultiSelectQuestion extends BaseQuestion {
  options: string[];
  maxSelections?: number;
  minSelections?: number;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.options = data.options || [];
    this.maxSelections = data.maxSelections;
    this.minSelections = data.minSelections;
  }
}

/**
 * Dropdown question for single choice selection
 * Renders as dropdown menu component
 */
export class DropdownQuestion extends BaseQuestion {
  options: string[];
  placeholder?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.options = data.options || [];
    this.placeholder = data.placeholder;
  }
}

/**
 * Toggle question for boolean on/off input
 * Renders as switch component
 */
export class ToggleQuestion extends BaseQuestion {
  default: boolean;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.default = data.default || false;
  }
}

/**
 * Select question for single choice buttons
 * Renders as button group component
 */
export class SelectQuestion extends BaseQuestion {
  options: string[];
  default?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.options = data.options || [];
    this.default = data.default;
  }
}

/**
 * Statement question for informational messages
 * Displays text without requiring user input
 */
export class StatementQuestion extends BaseQuestion {
  constructor(data: any, context: QuestionContext) {
    super(data, context);
  }
}

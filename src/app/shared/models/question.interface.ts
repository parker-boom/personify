export type QuestionType =
  | 'slider'
  | 'short_text'
  | 'long_text'
  | 'multi_select'
  | 'dropdown'
  | 'toggle'
  | 'select'
  | 'statement';

export interface QuestionContext {
  categoryId: string;
  subcategoryId: string;
  order: number;
}

// Base question class for common properties
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

// Specific question types extending the base
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

export class TextQuestion extends BaseQuestion {
  maxLength?: number;
  placeholder?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.maxLength = data.maxLength;
    this.placeholder = data.placeholder;
  }
}

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

export class DropdownQuestion extends BaseQuestion {
  options: string[];
  placeholder?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.options = data.options || [];
    this.placeholder = data.placeholder;
  }
}

export class ToggleQuestion extends BaseQuestion {
  default: boolean;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.default = data.default || false;
  }
}

export class SelectQuestion extends BaseQuestion {
  options: string[];
  default?: string;

  constructor(data: any, context: QuestionContext) {
    super(data, context);
    this.options = data.options || [];
    this.default = data.default;
  }
}

export class StatementQuestion extends BaseQuestion {
  constructor(data: any, context: QuestionContext) {
    super(data, context);
  }
}

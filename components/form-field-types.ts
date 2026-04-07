export type FormFieldValidationErrorCode =
  | 'invalid_length'
  | 'not_enough_unique_characters'
  | 'invalid_email';

export type FormFieldValidationProp = {
  id: FormFieldValidationErrorCode;
  message: string;
  passed: boolean;
}[];

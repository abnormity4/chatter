export type UsernameValidationErrorIds = 'too_short' | 'too_long';

export type UserNameValidationErrorsProp = {
  id: UsernameValidationErrorIds;
  message: string;
  passed: boolean;
}[];

export type FormFieldStatusCode = 'neutral' | 'error' | 'success' | 'loading';

type UsernameValidationErrorIds =
  | 'invalid_length'
  | 'not_enough_unique_characters';

export type UserNameValidationErrorsProp = {
  id: UsernameValidationErrorIds;
  message: string;
  passed: boolean;
}[];

export type FormFieldStatusCode = 'neutral' | 'error' | 'success' | 'loading';

export type CreateUserResponse = {
  success: boolean;
  message: string;
};

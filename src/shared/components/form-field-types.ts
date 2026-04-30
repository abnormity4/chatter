import { UIState } from '@/src/shared/types';

export type FormFieldProps = {
  status?: UIState;
  children: React.ReactNode;
  errorList?: FormFieldValidationProp;
};

export type FormFieldContextType = {
  id: string;
  status?: FormFieldProps['status'];
  errorList?: FormFieldProps['errorList'];
};

export type FormFieldValidationErrorCode =
  | 'invalid_length'
  | 'not_enough_unique_characters'
  | 'invalid_email';

export type FormFieldValidationProp = {
  id: FormFieldValidationErrorCode;
  message: string;
  passed: boolean;
}[];

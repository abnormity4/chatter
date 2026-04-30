import type { UIState } from '@/src/shared/types';

export type FormFieldUIStatus = {
  status: UIState;
  message: string | null;
};

export type AuthServerResponse = {
  success: boolean;
  message: string;
};

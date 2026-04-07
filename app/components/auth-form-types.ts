import type { UIState } from '@/lib/types';

export type FormFieldUIStatus = {
  status: UIState;
  message: string | null;
};

export type AuthServerResponse = {
  success: boolean;
  message: string;
};

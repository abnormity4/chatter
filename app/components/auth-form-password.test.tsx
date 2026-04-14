import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AuthForm from './auth-form';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('auth password component', () => {
  let passwordForm: HTMLInputElement;

  beforeEach(() => {
    render(<AuthForm />);
    passwordForm = screen.getByLabelText(/Password/i);
  });

  test('display password validation errors on input', async () => {
    await userEvent.type(passwordForm, '123');

    expect(screen.getByText(/Must be at least/i)).toBeInTheDocument();
  });

  test('hide password validation when input is cleared', async () => {
    await userEvent.type(passwordForm, '123');
    await userEvent.clear(passwordForm);

    await waitFor(() => {
      expect(screen.queryByText(/Must be at least/i)).not.toBeInTheDocument();
    });
  });
});

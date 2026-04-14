import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AuthForm from './auth-form';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('authform component', () => {
  beforeEach(() => {
    render(<AuthForm />);
  });

  test('switch form modes on click', async () => {
    await userEvent.click(screen.getByRole('button', { name: /Log in/i }));
    expect(
      screen.getByRole('button', { name: /Sign up/i }),
    ).toBeInTheDocument();
  });

  test('submit button is disabled when form is invalid', async () => {
    const emailForm = screen.getByLabelText(/Email/i);
    const passwordForm = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', {
      name: /Create account/i,
    });

    await userEvent.type(emailForm, 'test@test');
    await userEvent.type(passwordForm, '123');

    expect(submitButton).toBeDisabled();
  });
});

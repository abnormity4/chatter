import { useState, useRef, ChangeEvent } from 'react';
import FormField from '@/components/form-field';
import { debounce } from '@/lib/utils';
import type { FormFieldUIStatus } from './auth-form-types';
import { useAuthFormContext } from './auth-form';
import { isEmailValid } from '@/app/schemas';

const AuthFormEmail = () => {
  const { setFormData, setFormValidation, formMode } = useAuthFormContext();

  const [emailForm, setEmailForm] = useState<FormFieldUIStatus>({
    status: 'neutral',
    message: null,
  });

  const formStatus = {
    loading() {
      setEmailForm({ status: 'loading', message: null });
    },
    validationFailed() {
      setEmailForm({
        status: 'error',
        message: 'Please enter a valid email address.',
      });
    },
    mailAlreadyInUse() {
      setEmailForm({ status: 'error', message: 'Email is already in use.' });
    },
    tooManyRequests() {
      setEmailForm({
        status: 'error',
        message: 'Too many attempts. Please try again later.',
      });
    },
    reset() {
      setEmailForm({ status: 'neutral', message: null });
      setFormValidation((prev) => ({ ...prev, email: false }));
    },
    markAsValid() {
      setEmailForm({ status: 'success', message: null });
      setFormValidation((prev) => ({ ...prev, email: true }));
    },
  };

  const abortController = useRef<AbortController | null>(null);

  const debounceValidation = useRef(
    debounce(async (value: string) => {
      const validationResult = isEmailValid(value);

      if (!validationResult) {
        formStatus.validationFailed();
        return;
      }

      if (formMode !== 'signup') {
        formStatus.markAsValid();
        return;
      }

      try {
        formStatus.loading();
        const controller = new AbortController();
        abortController.current = controller;

        const emailAvailability = await fetch('/api/auth/check-availability', {
          method: 'POST',
          body: JSON.stringify({ email: value }),
          signal: controller.signal,
        });
        const emailAvailabilityBody = await emailAvailability.json();

        if (emailAvailability.status === 429) {
          formStatus.tooManyRequests();
          return;
        }

        if (!emailAvailabilityBody.success) {
          formStatus.mailAlreadyInUse();
          return;
        }
      } catch (err) {
        const error = err as DOMException;
        if (error.name === 'AbortError') {
          return;
        }

        formStatus.validationFailed();
        return;
      }

      formStatus.markAsValid();
    }, 500),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    abortController.current?.abort();
    formStatus.reset();

    setFormData((prev) => ({ ...prev, email: value }));

    if (value === '') {
      debounceValidation.current.cancel();
      return;
    }

    debounceValidation.current(value);
  };

  return (
    <FormField status={emailForm.status}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Input
        type='email'
        placeholder='mail@example.com'
        onChange={(e) => {
          handleChange(e);
        }}>
        <FormField.Loader />
      </FormField.Input>
      <FormField.Message>{emailForm.message}</FormField.Message>
    </FormField>
  );
};

export default AuthFormEmail;
